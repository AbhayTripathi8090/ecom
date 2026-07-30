import { Router } from "express";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../auth/auth.middleware";
import {
  createRazorpayOrder,
  findAll,
  findById,
  findByOrder,
  updateStatus,
  verifyRazorpayPayment,
} from "./payment.controller";
import {
  orderPaymentParamSchema,
  paymentIdParamSchema,
  paymentQuerySchema,
  updatePaymentStatusSchema,
} from "./payment.validation";

const router = Router();

router.use(authenticate);

router.post("/razorpay/create-order", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);

router.get("/", authorize("admin"), validate(paymentQuerySchema, "query"), findAll);
router.get(
  "/order/:orderId",
  validate(orderPaymentParamSchema, "params"),
  findByOrder,
);
router.get("/:id", validate(paymentIdParamSchema, "params"), findById);
router.patch(
  "/:id/status",
  authorize("admin"),
  validate(paymentIdParamSchema, "params"),
  validate(updatePaymentStatusSchema),
  updateStatus,
);

export default router;
