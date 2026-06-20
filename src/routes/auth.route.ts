import { Router } from "express";
import { deleteUser, forgotPass, getAllUsers, getUserProfile, logout, resetPassword, signin, signup, updateUser } from "../controllers/user.controller";
import { authorize, authProtect } from "../middlewares/auth";

const authRouter=Router();

authRouter.post('/signup',signup);
authRouter.post('/signin',signin);
authRouter.patch('/update/:id',authProtect,authorize(["admin","teacher"]),updateUser);
authRouter.delete('/delete/:id',authProtect,authorize(["admin","teacher"]),deleteUser);
authRouter.get('/profile',authProtect,getUserProfile);
authRouter.post('/logout',logout);
authRouter.get('/',authProtect,authorize(['admin','teacher']),getAllUsers);

// forgot pass
authRouter.post('/forgot-password',forgotPass);
authRouter.post("/reset-password/:token", resetPassword);



export default authRouter;