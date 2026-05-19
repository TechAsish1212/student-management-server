import { Router } from "express";
import { authorize, authProtect } from "../middlewares/auth";
import { createClass } from "../controllers/class.controller";

const classRouter=Router();
classRouter.post('/create',createClass);

export default classRouter;