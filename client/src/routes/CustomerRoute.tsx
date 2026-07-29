import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { selectIsAuthenticated, selectUserRole } from "../features/auth";

export const CustomerRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);

  if (isAuthenticated && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};
