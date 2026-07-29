import { Router } from "express";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../auth/auth.middleware";
import { create, findMine, remove, update, updateStatus } from "./shipping.controller";
import {
  addressIdParamSchema,
  addressSchema,
  shippingOrderParamSchema,
  updateAddressSchema,
  updateShippingStatusSchema,
} from "./shipping.validation";

const router = Router();

router.use(authenticate);

router.get("/addresses", authorize("user", "admin"), findMine);
router.post("/addresses", authorize("user", "admin"), validate(addressSchema), create);
router.patch(
  "/addresses/:id",
  authorize("user", "admin"),
  validate(addressIdParamSchema, "params"),
  validate(updateAddressSchema),
  update,
);
router.delete(
  "/addresses/:id",
  authorize("user", "admin"),
  validate(addressIdParamSchema, "params"),
  remove,
);

router.patch(
  "/orders/:orderId/status",
  authorize("admin"),
  validate(shippingOrderParamSchema, "params"),
  validate(updateShippingStatusSchema),
  updateStatus,
);

export default router;
