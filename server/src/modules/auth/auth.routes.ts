import { Router } from "express";
import { upload } from "../../middleware/upload.middleware";
import { validate } from "../../middleware/validate";
import {
  changePassword,
  getMe,
  login,
  logout,
  register,
  updateProfileImage,
} from "./auth.controller";
import { authenticate } from "./auth.middleware";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  upload.single("profileImage"),
  validate(registerSchema),
  register,
);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

router.get("/me", authenticate, getMe);
router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword,
);
router.patch(
  "/profile-image",
  authenticate,
  upload.single("profileImage"),
  updateProfileImage,
);

export default router;
