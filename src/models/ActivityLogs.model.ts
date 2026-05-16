import mongoose, { Schema, Types } from "mongoose";

export interface IActivityLog {
    user: Types.ObjectId;
    action: string;
    details?: string;
    createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    action: {
        type: String,
        required: true,
    },
    details: {
        type: String,
    }
}, { timestamps: true });

const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

export { ActivityLog }