import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ActivityLog } from "../models/ActivityLogs.model";

// system activity logs (includes pagination)
export const getActivities = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const count=await ActivityLog.countDocuments();

        const logs=await ActivityLog.find()
        .populate("user","name email role")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);

        res.json({
            logs,
            page,
            pages:Math.ceil(count/limit),
            total:count,
        })

    } catch (error) {
        console.log("error:: ", error)
        throw new ApiError(500, "Server Error")
    }
}