import { Router } from "express";
import authRouter from "./auth.route";
import activityRouter from "./activityLogs.route";
import academicYearRoute from "./academicYear.route";
import classRouter from "./class.route";
import subjectRoute from "./subject.route";

const routes=Router();

routes.use('/auth',authRouter);
routes.use('/activities',activityRouter);
routes.use('/academic-year',academicYearRoute);
routes.use('/class',classRouter);
routes.use('/subject',subjectRoute);

export default routes;