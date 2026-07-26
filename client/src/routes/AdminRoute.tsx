import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { selectIsAuthenticated, selectUserRole } from "../features/auth";

export const AdminRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
