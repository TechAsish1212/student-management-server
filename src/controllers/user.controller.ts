import { Request, Response } from "express";
import { User } from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { generateToken } from "../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
    try {

        const { name, email, password, role, studentClass, teacherSubject, isActive } = req.body;

        const existUser = await User.findOne({ email });

        if (existUser) {
            throw new ApiError(409, 'user already exist with this email');
        }

        if (password.length < 8) {
            throw new ApiError(400, "Password must be at least 8 character");
        }

        // create new user
        const newUser = await User.create({
            name,
            email,
            password,
            role,
            studentClass,
            teacherSubject,
            isActive
        });

        if (newUser) {
            return res.status(201).json(
                new ApiResponse(200, newUser, "User Registered Successfully")
            )
        } else {
            throw new ApiError(400, "Invalid User data");
        }

    } catch (error) {
        console.error("Signup Error:", error);

        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : error
        });
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const existUser = await User.findOne({ email });
        if (!existUser) {
            throw new ApiError(404, "User not exist.Please signup");
        }

        const passwordValid = await existUser.matchPassword(password);

        if (existUser && passwordValid) {
            // gen token
            generateToken(existUser.id.toString(), res);
            res.json(existUser);
        } else {
            throw new ApiError(401, "Invalid email or password");
        }
    } catch (error) {
        console.error("Signin Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : error
        });
    }
}

