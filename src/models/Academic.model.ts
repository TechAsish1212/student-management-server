import mongoose, { Schema } from "mongoose";

export interface IAcademicYear {
    name: string;
    fromYear: Date;
    toYear: Date;
    isCurrent: boolean;
}

const academicYearSchema = new Schema<IAcademicYear>({
    name: {
        type: String,
        required: true,
    },
    fromYear: {
        type: Date,
        required: true,
    },
    toYear: {
        type: Date,
        required: true,
    },
    isCurrent: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const AcademicYear = mongoose.model<IAcademicYear>('AcademicYear', academicYearSchema);

export { AcademicYear }