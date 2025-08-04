import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to identify public routes
function isPublicRoute(path: string): boolean {
  const publicRoutes = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/activate-account",
  ];
  return publicRoutes.some((route) => path.startsWith(route));
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);

  // Use individual selectors
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Token validation and refresh logic
  useEffect(() => {
    const validateAuth = async () => {
      try {
        const isAuth = await checkAuth();
        setAuthenticated(isAuth);
      } catch (error) {
        console.error("Auth validation error:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();

    // Set up periodic token checks (every 5 minutes)
    const intervalId = setInterval(validateAuth, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [accessToken, refreshToken, checkAuth]);

  // Handle redirects based on auth state
  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      if (isPublicRoute(location.pathname)) {
        navigate("/", { replace: true });
      }
    } else {
      if (!isPublicRoute(location.pathname)) {
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
