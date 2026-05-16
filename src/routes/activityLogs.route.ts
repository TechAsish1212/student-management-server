import { Router } from "express";
import { getActivities } from "../controllers/activity.controller";
import { authorize, authProtect } from "../middlewares/auth";

const activityRouter = Router();

activityRouter.get('/', authProtect, authorize(["admin", "teacher"]), getActivities);

export default activityRouter;
