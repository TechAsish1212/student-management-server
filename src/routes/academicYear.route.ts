import { Router } from "express";
import { createAcademicYear } from "../controllers/academicYear.controller";
import { authorize, authProtect } from "../middlewares/auth";

const academicYearRoute=Router();
academicYearRoute.post('/create',authProtect,authorize(['admin']),createAcademicYear)

export default academicYearRoute;