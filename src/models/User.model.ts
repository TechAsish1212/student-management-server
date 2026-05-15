import mongoose, { Schema } from "mongoose";

export enum UserRole {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
    PARENT = 'parent',
}

export type userRoles = 'admin' | 'teacher' | 'student' | 'parent';

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: userRoles;
    isActive: boolean;
    studentClass?: string | null;
    teacherSubject?: string[] | null;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        maxLength: [50, "Name can't be more than 50 characters."],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Provide a valid email"],
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password must be at least 8 characters.'],
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    studentClass:{
        type:String,
        default:null,
    },
    teacherSubject:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subject'
        
    }]

}, { timestamps: true })