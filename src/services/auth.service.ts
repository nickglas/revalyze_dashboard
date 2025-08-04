import { useAuthStore } from "@/store/authStore";
import api from "@/util/axios";
import { isTokenExpired } from "@/util/jwt";
import axios from "axios";

export const AuthService = {
  async login(email: string, password: string) {
    const res = await api.post("/api/v1/auth/login", { email, password });
    const { accessToken, refreshToken } = res.data;

    useAuthStore.getState().setTokens(accessToken, refreshToken);
  },

  async validateToken(): Promise<boolean> {
    const { accessToken, refreshToken, setTokens, clearTokens } =
      useAuthStore.getState();

    if (!accessToken || isTokenExpired(accessToken)) {
      if (!refreshToken) {
        clearTokens();
        return true;
      }

      try {
        const res = await axios.post(
          "/api/v1/auth/refresh",
          { refreshToken },
          { baseURL: import.meta.env.DEV ? "http://localhost:4500" : "" }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          res.data;
        setTokens(newAccessToken, newRefreshToken);
        return false;
      } catch (err) {
        clearTokens();
        return true;
      }
    }

    return false;
  },

  async logout() {
    try {
      await api.post("/api/v1/auth/logout", { logoutAllDevices: true });
    } catch (err) {
      console.warn("Logout failed or already expired");
    } finally {
      useAuthStore.getState().logout();
    }
  },

  async refresh() {
    const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();
    if (!refreshToken) return false;

    try {
      const res = await api.post("/api/v1/auth/refresh", { refreshToken });
      const { accessToken, refreshToken: newRefresh } = res.data;
      setTokens(accessToken, newRefresh);
      return true;
    } catch (err) {
      clearTokens();
      return false;
    }
  },
};
