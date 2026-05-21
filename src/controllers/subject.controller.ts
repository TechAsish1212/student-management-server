import { Request, Response } from "express";
import { Subject } from "../models/Subject.model";
import { ApiError } from "../utils/ApiError";
import { activityLog } from "../utils/activityLogs";

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
            userId: (req as any).user._id,
            action: `Created Subject:: ${newSubject.name} and ${newSubject.code}`
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