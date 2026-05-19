import { Router } from "express";
import { authorize, authProtect } from "../middlewares/auth";
import { createClass, updateClass } from "../controllers/class.controller";

const classRouter=Router();
classRouter.post('/create',authProtect,authorize(['admin']),createClass);
classRouter.patch('/update/:id',authProtect,authorize(['admin']),updateClass);


export default classRouter;