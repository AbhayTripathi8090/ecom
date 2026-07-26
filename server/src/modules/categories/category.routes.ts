import { Router } from "express";
import { upload } from "../../middleware/upload.middleware";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../auth/auth.middleware";
import { create, findAll, findById, remove, update } from "./category.controller";
import {
  categoryIdParamSchema,
  categoryQuerySchema,
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation";

const router = Router();

router.use(authenticate);

router.get("/", validate(categoryQuerySchema, "query"), findAll);
router.get("/:id", validate(categoryIdParamSchema, "params"), findById);

router.post(
  "/",
  authorize("admin"),
  upload.single("image"),
  validate(createCategorySchema),
  create,
);
router.patch(
  "/:id",
  authorize("admin"),
  validate(categoryIdParamSchema, "params"),
  upload.single("image"),
  validate(updateCategorySchema),
  update,
);
router.delete(
  "/:id",
  authorize("admin"),
  validate(categoryIdParamSchema, "params"),
  remove,
);

export default router;
