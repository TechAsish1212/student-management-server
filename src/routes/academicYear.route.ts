import { Router } from "express";
import { createAcademicYear, getCurrentAcademicYear } from "../controllers/academicYear.controller";
import { authorize, authProtect } from "../middlewares/auth";

const academicYearRoute=Router();
academicYearRoute.post('/create',authProtect,authorize(['admin']),createAcademicYear);
academicYearRoute.get('/current',authProtect,getCurrentAcademicYear);

export default academicYearRoute;