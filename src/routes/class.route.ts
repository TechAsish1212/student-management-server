import { Router } from "express";
import { authorize, authProtect } from "../middlewares/auth";
import { createClass, deleteClass, getAllClass, updateClass } from "../controllers/class.controller";

const classRouter=Router();
classRouter.post('/create',authProtect,authorize(['admin']),createClass);
classRouter.patch('/update/:id',authProtect,authorize(['admin']),updateClass);
classRouter.delete('/delete/:id',authProtect,authorize(['admin']),deleteClass);

export default classRouter;