import { Router } from "express";
import { upload } from "../../middleware/upload.middleware";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../auth/auth.middleware";
import { create, findAll, findById, remove, update } from "./product.controller";
import {
  createProductSchema,
  productIdParamSchema,
  productQuerySchema,
  updateProductSchema,
} from "./product.validation";

const router = Router();

// Public routes for fetching products
router.get("/", validate(productQuerySchema, "query"), findAll);
router.get("/:id", validate(productIdParamSchema, "params"), findById);

// Protected Admin routes
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.array("images", 8),
  validate(createProductSchema),
  create,
);
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(productIdParamSchema, "params"),
  upload.array("images", 8),
  validate(updateProductSchema),
  update,
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(productIdParamSchema, "params"),
  remove,
);

export default router;
