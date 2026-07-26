import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { selectIsAuthenticated } from "../features/auth";

export const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
