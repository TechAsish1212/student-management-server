import { Router } from "express";
import authRouter from "./auth.route";
import activityRouter from "./activityLogs.route";

const routes=Router();

routes.use('/auth',authRouter);
routes.use('/activities',activityRouter);

export default routes;