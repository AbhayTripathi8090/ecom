import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { selectIsAuthenticated, selectUserRole } from "../features/auth";
import { ForbiddenPage } from "../pages/NotFound/ForbiddenPage";

export const AdminRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "admin") {
    return <ForbiddenPage />;
  }

  return <Outlet />;
};
