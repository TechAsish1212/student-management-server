import { Router } from "express";
import { deleteUser, signin, signup, updateUser } from "../controllers/user.controller";
import { authorize, authProtect } from "../middlewares/auth";

const authRouter=Router();

authRouter.post('/signup',authProtect,authorize(["admin","teacher"]),signup);
authRouter.post('/signin',signin);
authRouter.patch('/update/:id',authProtect,authorize(["admin","teacher"]),updateUser);
authRouter.delete('/delete/:id',authProtect,authorize(["admin","teacher"]),deleteUser);



export default authRouter;