import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.middleware";
import { getDashboard } from "./dashboard.controller";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/", getDashboard);

export default router;
