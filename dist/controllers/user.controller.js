"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const User_model_1 = require("../models/User.model");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const generateToken_1 = require("../utils/generateToken");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role, studentClass, teacherSubject, isActive } = req.body;
        const existUser = yield User_model_1.User.findOne({ email });
        if (existUser) {
            throw new ApiError_1.ApiError(409, 'user already exist with this email');
        }
        if (password.length < 8) {
            throw new ApiError_1.ApiError(400, "Password must be at least 8 character");
        }
        // create new user
        const newUser = yield User_model_1.User.create({
            name,
            email,
            password,
            role,
            studentClass,
            teacherSubject,
            isActive
        });
        if (newUser) {
            return res.status(201).json(new ApiResponse_1.ApiResponse(200, newUser, "User Registered Successfully"));
        }
        else {
            throw new ApiError_1.ApiError(400, "Invalid User data");
        }
    }
    catch (error) {
        console.error("Signup Error:", error);
        if (error instanceof ApiError_1.ApiError) {
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
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existUser = yield User_model_1.User.findOne({ email });
        if (!existUser) {
            throw new ApiError_1.ApiError(404, "User not exist.Please signup");
        }
        const passwordValid = yield existUser.matchPassword(password);
        if (existUser && passwordValid) {
            // gen token
            (0, generateToken_1.generateToken)(existUser.id.toString(), res);
            res.json(existUser);
        }
        else {
            throw new ApiError_1.ApiError(401, "Invalid email or password");
        }
    }
    catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : error
        });
    }
});
exports.signin = signin;
//# sourceMappingURL=user.controller.js.map