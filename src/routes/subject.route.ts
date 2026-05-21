import { Router } from "express";
import { authorize, authProtect } from "../middlewares/auth";
import { createSubject } from "../controllers/subject.controller";

const subjectRoute=Router();

subjectRoute.post('/create',authProtect,authorize(['admin','teacher']),createSubject);

export default subjectRoute;