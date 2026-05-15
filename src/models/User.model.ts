import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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
        default: UserRole.STUDENT,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    studentClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    teacherSubject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'

    }]

}, { timestamps: true });

// hash password before save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// compare password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model<IUser>('User', userSchema);

export { User }