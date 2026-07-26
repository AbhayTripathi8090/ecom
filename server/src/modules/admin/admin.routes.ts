import { Router } from "express";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../auth/auth.middleware";
import { changeUserRole, changeUserStatus, findUsers } from "./admin.controller";
import {
  adminUserParamSchema,
  adminUserQuerySchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "./admin.validation";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/users", validate(adminUserQuerySchema, "query"), findUsers);
router.patch(
  "/users/:id/role",
  validate(adminUserParamSchema, "params"),
  validate(updateUserRoleSchema),
  changeUserRole,
);
router.patch(
  "/users/:id/status",
  validate(adminUserParamSchema, "params"),
  validate(updateUserStatusSchema),
  changeUserStatus,
);

export default router;
