import { Router } from "express";
import { createAcademicYear, getCurrentAcademicYear, updateAcademicYear } from "../controllers/academicYear.controller";
import { authorize, authProtect } from "../middlewares/auth";

const academicYearRoute=Router();
academicYearRoute.post('/create',authProtect,authorize(['admin']),createAcademicYear);
academicYearRoute.get('/current',authProtect,getCurrentAcademicYear);
academicYearRoute.patch('/update/:id',authProtect,updateAcademicYear)

export default academicYearRoute;