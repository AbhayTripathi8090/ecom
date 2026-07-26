import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/Home";
import { LoginPage, RegisterPage } from "../pages/Auth";
import { ProfilePage } from "../pages/Profile";
import { CategoryListPage } from "../pages/Category";
import { ProductListPage, ProductDetailPage } from "../pages/Product";
import { NotFoundPage } from "../pages/NotFound";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { MainLayout } from "../components/layout/MainLayout";

export const AppRoutes: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        {/* Public Catalog Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoryListPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        {/* Guest Routes (only accessible when logged out) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes (require auth) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
};
