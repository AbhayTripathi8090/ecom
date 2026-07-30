import { Router } from "express";
import { validate } from "../../middleware/validate";
import { authenticate, authorize } from "../auth/auth.middleware";
import {
  addItemToWishlist,
  clearMyWishlist,
  findMyWishlist,
  removeItemFromWishlist,
} from "./wishlist.controller";
import {
  wishlistProductParamSchema,
  wishlistProductSchema,
} from "./wishlist.validation";

const router = Router();

router.use(authenticate, authorize("user", "admin"));

router.get("/", findMyWishlist);
router.post("/products", validate(wishlistProductSchema), addItemToWishlist);
router.delete(
  "/products/:productId",
  validate(wishlistProductParamSchema, "params"),
  removeItemFromWishlist,
);
router.delete("/", clearMyWishlist);

export default router;
