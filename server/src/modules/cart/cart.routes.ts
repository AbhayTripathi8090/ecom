import { Router } from "express";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../auth/auth.middleware";
import { addItem, clear, findMyCart, removeItem, updateItem } from "./cart.controller";
import {
  addCartItemSchema,
  cartProductParamSchema,
  updateCartItemSchema,
} from "./cart.validation";

const router = Router();

router.use(authenticate, authorize("user", "admin"));

router.get("/", findMyCart);
router.post("/items", validate(addCartItemSchema), addItem);
router.patch(
  "/items/:productId",
  validate(cartProductParamSchema, "params"),
  validate(updateCartItemSchema),
  updateItem,
);
router.delete(
  "/items/:productId",
  validate(cartProductParamSchema, "params"),
  removeItem,
);
router.delete("/", clear);

export default router;
