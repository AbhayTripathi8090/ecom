import { Router } from "express";
import { upload } from "../../middleware/upload.middleware";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../auth/auth.middleware";
import {
  changePassword,
  deleteMe,
  getMe,
  getUserById,
  updateMe,
} from "./user.controller";
import {
  changePasswordSchema,
  updateMeSchema,
  userIdParamSchema,
} from "./user.validation";

const router = Router();

router.use(authenticate);

router.get("/me", getMe);
router.patch("/me", upload.single("profileImage"), validate(updateMeSchema), updateMe);
router.patch(
  "/change-password",
  validate(changePasswordSchema),
  changePassword,
);
router.delete("/me", deleteMe);

router.get("/:id", authorize("admin"), validate(userIdParamSchema, "params"), getUserById);

export default router;
