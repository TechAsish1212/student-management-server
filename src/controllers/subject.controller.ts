import { Request, Response } from "express";
import { Subject } from "../models/Subject.model";
import { ApiError } from "../utils/ApiError";
import { activityLog } from "../utils/activityLogs";
import mongoose from "mongoose";

export const createSubject = async (req: Request, res: Response) => {
    try {
        const { name, code, teacher, isActive } = req.body;

        const existingSubject = await Subject.findOne({ code });
        if (existingSubject) {
            throw new ApiError(400, "Subject code is exist");
        }

        const newSubject = await Subject.create({
            name,
            code,
            teacher: Array.isArray(teacher) ? teacher : [],
            isActive,
        });

        await activityLog({
            userId: (req as any).user._id.toString(),
            action: `Created Subject:: ${newSubject.name} ${newSubject.code}`
        })

        return res.status(201).json({
            message: "Subject created successfully",
            newSubject
        })
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// update subject
export const updateSubject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, code, teacher, isActive } = req.body;

        const existSubject = await Subject.findById(id);
        if (!existSubject) {
            throw new ApiError(404, "Subject Not Found");
        }

        if (code && code !== existSubject.code) {
            const codeExists = await Subject.findOne({ code, _id: { $ne: id } });
            if (codeExists) {
                throw new ApiError(400, "Subject code already exists");
            }
        }

        // convert teacher ids to objectId
        let teacherIds: mongoose.Types.ObjectId[] | undefined;
        if (teacher !== undefined) {
            teacherIds = Array.isArray(teacher) && teacher.length > 0
                ? teacher.map((id: string) => new mongoose.Types.ObjectId(id))
                : [];
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (code) updateData.code = code;
        if (teacher !== undefined) updateData.teacher = teacherIds;
        if (isActive !== undefined) updateData.isActive = isActive;

        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )

        await activityLog({
            userId: (req as any).user._id.toString(),
            action: `Updated Subject:: ${updatedSubject?.name} (${updatedSubject?.code})`
        });

        return res.status(200).json({
            message: "Subject updated successfully",
            updatedSubject
        });

    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// get all subjects
export const getAllSubject = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const skip = (page - 1) * limit;

        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } },
            ];
        }

        const [total, subjects] = await Promise.all([
            Subject.countDocuments(query),
            Subject
                .find(query)
                .populate("teacher", "name email")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
        ]);

        res.json({
            subjects,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        });

    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}