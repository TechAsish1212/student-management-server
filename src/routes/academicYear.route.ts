import { Router } from "express";
import { createAcademicYear, deleteAcademicYear, getCurrentAcademicYear, updateAcademicYear } from "../controllers/academicYear.controller";
import { authorize, authProtect } from "../middlewares/auth";

const academicYearRoute=Router();
academicYearRoute.post('/create',authProtect,authorize(['admin']),createAcademicYear);
academicYearRoute.get('/current',authProtect,getCurrentAcademicYear);
academicYearRoute.patch('/update/:id',authProtect,authorize(['admin']),updateAcademicYear);
academicYearRoute.delete('/delete/:id',authProtect,authorize(['admin']),deleteAcademicYear);


export default academicYearRoute;