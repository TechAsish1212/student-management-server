import { Router } from "express";
import { signin, signup } from "../controllers/user.controller";
import { authorize, authProtect } from "../middlewares/auth";

const authRouter=Router();

authRouter.post('/signup',authProtect,authorize(["admin","teacher"]),signup);
authRouter.post('/signin',signin);


export default authRouter;