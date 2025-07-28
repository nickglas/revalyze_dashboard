import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export const PrivateRoute = () => {
  const token = useAuthStore((state) => state.accessToken);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
