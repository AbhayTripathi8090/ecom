import { Router, Request, Response } from "express";
import adminRoutes from "../modules/admin/admin.routes";
import authRoutes from "../modules/auth/auth.routes";
import cartRoutes from "../modules/cart/cart.routes";
import categoryRoutes from "../modules/categories/category.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import orderRoutes from "../modules/orders/order.routes";
import paymentRoutes from "../modules/payments/payment.routes";
import productRoutes from "../modules/products/product.routes";
import shippingRoutes from "../modules/shipping/shipping.routes";
import userRoutes from "../modules/users/user.routes";
import wishlistRoutes from "../modules/wishlist/wishlist.routes";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/shipping", shippingRoutes);
router.use("/admin", adminRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
