import { Request, Response } from "express";
import { User } from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { generateToken } from "../utils/generateToken";
import { activityLog } from "../utils/activityLogs";
import { AuthRequest } from "../middlewares/auth";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";

export const signup = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role,
      studentClass,
      teacherSubject,
      isActive,
    } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) {
      throw new ApiError(409, "user already exist with this email");
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
      isActive,
    });

    if (newUser) {
      if ((req as any).user) {
        await activityLog({
          userId: (req as any).user._id,
          action: "Registered User",
          details: `Registered user with email: ${newUser.email}`,
        });
      }

      return res
        .status(201)
        .json(new ApiResponse(200, newUser, "User Registered Successfully"));
    } else {
      throw new ApiError(400, "Invalid User data");
    }
  } catch (error) {
    console.error("Signup Error:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Please provide email and password");
    }

    const existUser = await User.findOne({ email });
    if (!existUser) {
      throw new ApiError(404, "User not exist.Please signup");
    }

    const passwordValid = await existUser.matchPassword(password);

    if (existUser && passwordValid) {
      // gen token
      const token=generateToken(existUser.id.toString(), res);
      res.status(200).json({
        success: true,
        message: "Signin successful",
        token,
        user: existUser,
      });
    } else {
      throw new ApiError(401, "Invalid email or password");
    }
  } catch (error) {
    console.error("Signin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// update user (Admin)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.isActive =
        req.body.isActive !== undefined ? req.body.isActive : user.isActive;

      user.studentClass = req.body.studentClass || user.studentClass;
      user.teacherSubject = req.body.teacherSubject || user.teacherSubject;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      if ((req as any).user) {
        await activityLog({
          userId: (req as any).user._id.toString(),
          action: "Updated User",
          details: `Updated user with email: ${updatedUser.email}`,
        });
      }

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        studentClass: updatedUser.studentClass,
        teacherSubject: updatedUser.teacherSubject,
        message: "User updated successfully",
      });
    } else {
      throw new ApiError(400, "User not found");
    }
  } catch (error) {
    console.log("Update user Error:: ", error);
    throw new ApiError(500, "Internal server Error");
  }
};

// delete user(admin)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();

      if ((req as any).user) {
        await activityLog({
          userId: (req as any).user._id.toString(),
          action: "Deleted User",
          details: `Deleted user with email: ${user.email}`,
        });
      }
      return res.status(200).json({ message: "User deleted Successfully" });
    } else {
      throw new ApiError(404, "User not found");
    }
  } catch (error) {
    console.log("Delete Error:: ", error);
    throw new ApiError(500, "Internal server Error");
  }
};

// get user profile
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user) {
      res.json({
        user: {
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      });
    }
  } catch (error) {
    console.log("Get user Error:: ", error);
    throw new ApiError(500, "Internal server error");
  }
};

// logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(200).json({ message: "User Logout Successfully" });
  } catch (error) {
    console.log("Logout Error:: ", error);
    throw new ApiError(500, "Internal server error");
  }
};

// get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // query params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    // filter
    const filter: any = {};

    if (role && role !== "all" && role !== "") {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // fetch user with pagination and filter
    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select("-password")
        // .populate("studentClass", "_id name section")
        // .populate("teacherSubject", "_id name code")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    // res
    res.json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.log("all users Error:: ", error);

    throw new ApiError(500, "Internal server error");
  }
};

// forgot pass
export const forgotPass = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is Required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    // reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name || "User"},</p>
        <p>Click the button below to reset your password.</p>

        <a href="${resetUrl}"
           style="background:#667eea;color:white;padding:12px 20px;
           text-decoration:none;border-radius:5px;display:inline-block;">
           Reset Password
        </a>

        <p style="margin-top:20px;">
          This link will expire in 15 minutes.
        </p>

        <p>If you didn't request a password reset, please ignore this email.</p>

        <p>${resetUrl}</p>
      </div>
    `;

    await sendEmail(
      user.email,
      "Reset your password - Tech",
      `Reset your password using this link:${resetUrl}`,
      htmlContent,
    );

    return res.status(200).json({
      success:true,
      message:"Password reset link sent to email"
    })
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send password reset email",
    });
  }
};

// reset pass
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(String(token))
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired token");
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });

    
  } catch (error:any) {
    return res.status(500).json({
      success:false,
      message:error.message || "Internal server error"
    })
  }
};
