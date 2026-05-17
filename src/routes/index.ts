import { Router } from "express";
import authRouter from "./auth.route";
import activityRouter from "./activityLogs.route";
import academicYearRoute from "./academicYear.route";

const routes=Router();

routes.use('/auth',authRouter);
routes.use('/activities',activityRouter);
routes.use('/academic-year',academicYearRoute);

export default routes;