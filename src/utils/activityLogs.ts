import { ActivityLog } from "../models/ActivityLogs.model"
import { ApiError } from "./ApiError";

export const activityLog=async({userId,action,details}:{userId:string,action:string,details?:string})=>{
    try {
        await ActivityLog.create({
            user:userId,
            action,
            details
        });

    } catch (error) {
        console.log("Failed to log activity: ",error);

        throw new ApiError(500,"Internal server error");
    }
}