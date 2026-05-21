import mongoose, { Schema } from "mongoose";

export interface ISubject {
    name: string;
    code: string;
    teacher?: mongoose.Types.ObjectId[];
    isActive: boolean;
}

const subjectSchema = new Schema<ISubject>({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    teacher: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

const Subject=mongoose.model("Subject",subjectSchema);

export {Subject};