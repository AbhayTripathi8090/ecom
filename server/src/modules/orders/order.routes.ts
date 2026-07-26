import { Router } from "express";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../auth/auth.middleware";
import { cancelMine, create, findAll, findById, findMine, updateStatus } from "./order.controller";
import {
  createOrderSchema,
  orderIdParamSchema,
  orderQuerySchema,
  updateOrderStatusSchema,
} from "./order.validation";

const router = Router();

router.use(authenticate);

router.post("/", authorize("user", "admin"), validate(createOrderSchema), create);
router.get("/my", authorize("user", "admin"), validate(orderQuerySchema, "query"), findMine);
router.get("/", authorize("admin"), validate(orderQuerySchema, "query"), findAll);
router.get("/:id", validate(orderIdParamSchema, "params"), findById);
router.patch(
  "/:id/status",
  authorize("admin"),
  validate(orderIdParamSchema, "params"),
  validate(updateOrderStatusSchema),
  updateStatus,
);
router.patch(
  "/:id/cancel",
  authorize("user", "admin"),
  validate(orderIdParamSchema, "params"),
  cancelMine,
);

export default router;
