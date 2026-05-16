"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, res) => {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
        algorithm: 'HS512'
    });
    // attach token to http-only   
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/'
    });
};
exports.generateToken = generateToken;
//# sourceMappingURL=generateToken.js.map