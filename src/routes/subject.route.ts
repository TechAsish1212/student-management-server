import { Router } from "express";
import { authorize, authProtect } from "../middlewares/auth";
import { createSubject, getAllSubject, updateSubject } from "../controllers/subject.controller";

const subjectRoute=Router();

subjectRoute.post('/create',authProtect,authorize(['admin','teacher']),createSubject);
subjectRoute.patch('/update/:id',authProtect,authorize(['admin','teacher']),updateSubject);
subjectRoute.get('/',authProtect,authorize(['admin','teacher']),getAllSubject);



export default subjectRoute;