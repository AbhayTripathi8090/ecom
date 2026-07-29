import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/Home";
import { LoginPage, RegisterPage } from "../pages/Auth";
import { ProfilePage } from "../pages/Profile";
import { CategoryListPage } from "../pages/Category";
import { ProductListPage, ProductDetailPage } from "../pages/Product";
import { NotFoundPage } from "../pages/NotFound";
import { CartPage } from "../pages/Cart";
import { CheckoutPage } from "../pages/Checkout";
import { OrdersPage, OrderDetailPage } from "../pages/Orders";
import { WishlistPage } from "../pages/Wishlist";

import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { CustomerRoute } from "./CustomerRoute";

import { CustomerLayout } from "../components/layout/CustomerLayout";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Guest Routes (accessible only when logged out) */}
      <Route element={<GuestRoute />}>
        <Route element={<CustomerLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Customer Routes */}
      <Route element={<CustomerRoute />}>
        <Route element={<CustomerLayout />}>
          {/* Public Catalog Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Protected Customer Routes (require customer authentication) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
