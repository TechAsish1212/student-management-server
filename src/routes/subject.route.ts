import { Router } from "express";
import { authorize, authProtect } from "../middlewares/auth";
import { createSubject, updateSubject } from "../controllers/subject.controller";

const subjectRoute=Router();

subjectRoute.post('/create',authProtect,authorize(['admin','teacher']),createSubject);
subjectRoute.patch('/update/:id',authProtect,authorize(['admin','teacher']),updateSubject);

export default subjectRoute;