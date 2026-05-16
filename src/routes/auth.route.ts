import { Router } from "express";
import { signin, signup, updateUser } from "../controllers/user.controller";
import { authorize, authProtect } from "../middlewares/auth";

const authRouter=Router();

authRouter.post('/signup',authProtect,authorize(["admin","teacher"]),signup);
authRouter.post('/signin',signin);
authRouter.patch('/update/:id',authProtect,authorize(["admin","teacher"]),updateUser);


export default authRouter;