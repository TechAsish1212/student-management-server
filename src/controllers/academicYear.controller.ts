import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { AcademicYear } from "../models/Academic.model";
import { activityLog } from "../utils/activityLogs";

export const createAcademicYear = async (req: Request, res: Response) => {
    try {
        const { name, fromYear, toYear, isCurrent } = req.body;
        const existingYear = await AcademicYear.findOne({ fromYear, toYear });
        if (existingYear) {
            throw new ApiError(400, "Academic Year already exist");
        }
        if (isCurrent) {
            await AcademicYear.updateMany(
                { _id: { $ne: null } },
                { isCurrent: false });
        }
        const academicYear = await AcademicYear.create({
            name,
            fromYear,
            toYear,
            isCurrent: isCurrent || false
        })
        await activityLog({
            userId: (req as any).user._id,
            action: `Created Academic year with ${name}`
        })
        res.status(201).json({
            message: "Academic Year Created Successfully",
            academicYear
        });
    } catch (error) {
        console.log("Academic creation error:: ", error);
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, "Internal Server Error");
    }
}