import { Router } from "express";
import { signin, signup } from "../controllers/user.controller";

const authRouter=Router();

authRouter.post('/signup',signup);
authRouter.post('/signin',signin);


export default authRouter;