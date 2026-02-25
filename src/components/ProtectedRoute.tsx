import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

export const ProtectedRoute = ({ role }: { role?: UserRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <Navigate to="/login" replace /></>
    );
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/counsellor/dashboard"} replace />;
  }

  return <Outlet />;
};
