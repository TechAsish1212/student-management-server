import { NextFunction, Request, Response } from "express";
import { IUser, User, userRoles } from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: IUser
}

// protect route
export const authProtect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
            req.user = await User.findById(decoded.userId).select('-password') as IUser;
            next();
        } catch (error) {
            console.log(error)
            throw new ApiError(401, "Not Authorized,token failed")
        }
    } else {
        throw new ApiError(401, "Not Authorized,no token")
    }
}

// access for admin and teacher 
export const authorize=(roles:userRoles[])=>{
    return (req:AuthRequest,res:Response,next:NextFunction)=>{
        if(!req.user){
            throw new ApiError(401,"Not Authorized ,User Not Found");
        }

        if(!roles.includes(req.user.role)){
            throw new ApiError(403,`User role '${req.user.role}' is not authorized to access this route`);
        }

        next();
    }
}