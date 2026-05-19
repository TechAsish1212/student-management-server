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

