import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Class } from "../models/Class.model";
import { activityLog } from "../utils/activityLogs";
import mongoose from "mongoose";

// creating class
export const createClass = async (req: Request, res: Response) => {
    try {
        const { name, academicYear, classTeacher, subjects, students, capacity } = req.body;
        if (!name || !academicYear) {
            return res.status(400).json({
                message: "Name and academicYear are required",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(academicYear)) {
            return res.status(400).json({
                message: "Invalid academicYear ID",
            });
        }
        if (classTeacher && !mongoose.Types.ObjectId.isValid(classTeacher)) {
            return res.status(400).json({
                message: "Invalid classTeacher ID",
            });
        }
        const existingClass = await Class.findOne({
            name: name.trim(),
            academicYear,
        });

        if (existingClass) {
            return res.status(400).json({
                message: "Class already exists for this academic year",
            });
        }

        const newClass = await Class.create({
            name: name.trim(),
            academicYear,
            classTeacher: classTeacher || null,
            subjects: subjects || [],
            students: students || [],
            capacity: capacity || 40,
        });

        if ((req as any).user?.id) {
            await activityLog({
                userId: (req as any).user.id,
                action: `Created class: ${newClass.name}`,
            });
        }
        return res.status(201).json({
            message: "Class created successfully",
            data: newClass,
        });
    } catch (error: any) {
        console.error("Create Class Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// update class
export const updateClass = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const {
            name,
            academicYear,
            classTeacher,
            subjects,
            students,
            capacity
        } = req.body;

        const existingClass = await Class.findById(id);

        if (!existingClass) {
            throw new ApiError(404, "Class Not Found");
        }

        if (name || academicYear) {
            const query: any = {
                _id: { $ne: id },
            };

            if (name) query.name = name.trim();
            if (academicYear) query.academicYear = academicYear;

            if (name && academicYear) {
                query.name = name.trim();
                query.academicYear = academicYear;
            }

            else if (name && !academicYear) {
                query.name = name.trim();
                query.academicYear = existingClass.academicYear;
            }
            else if (!name && academicYear) {
                query.name = existingClass.name;
                query.academicYear = academicYear;
            }

            const duplicateClass = await Class.findOne(query);

            if (duplicateClass) {
                throw new ApiError(
                    400,
                    "Another class already exists with this name in this academic year"
                );
            }
        }

        if (name) existingClass.name = name.trim();
        if (academicYear) existingClass.academicYear = academicYear;
        if (classTeacher !== undefined) existingClass.classTeacher = classTeacher;
        if (subjects !== undefined) existingClass.subjects = subjects;
        if (students !== undefined) existingClass.students = students;
        if (capacity !== undefined) existingClass.capacity = capacity;


        const updatedClass = await existingClass.save();


        await activityLog({
            userId: (req as any).user.id,
            action: `Updated class: ${updatedClass.name}`,
        });

        return res.status(200).json({
            message: "Class updated successfully.",
            data: updatedClass,
        });

    } catch (error: any) {
        console.log("updated class error:: ", error);


        if (error.code === 11000) {
            throw new ApiError(400, "Class with this name already exists in this academic year");
        }

        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, "Internal Server Error");
    }
};

// delete class
export const deleteClass = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const existingClass = await Class.findById(id);
        if (!existingClass) {
            throw new ApiError(404, "Class Not Found");
        }

        await Class.findByIdAndDelete(id);

        await activityLog({
            userId: (req as any).user.id,
            action: `Deleted class: ${existingClass.name}`
        });

        return res.status(200).json({
            message: "Class deleted successfully"
        })

    } catch (error) {
        console.log("Deleted class error: ", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
}

// get all class 
export const getAllClass = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || "";
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (search) {
            filter.name = {
                $regex: search,
                $options: 'i'
            }
        }

        const [total, classes] = await Promise.all([
            Class.countDocuments(filter),
            Class.find(filter)
                .populate("academicYear", "name")
                .populate("classTeacher", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
        ])

        return res.status(200).json({
            message:"Classes fetched successfully",
            classes,
            pagination:{
                total,
                page,
                pages:Math.ceil(total/limit)
            }
        })

    } catch (error) {
        console.log("Get all class error: ", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
}