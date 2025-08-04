import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { isTokenExpired } from "@/util/jwt";

interface AuthState {
  user: string | null;
  accessToken: string | null;
  refreshToken: string | null;

  checkAuth: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      async checkAuth() {
        const { accessToken, refreshToken, setTokens, clearTokens } = get();

        // 1. No tokens available
        if (!accessToken && !refreshToken) {
          return false;
        }

        // 2. Access token is valid
        if (accessToken && !isTokenExpired(accessToken)) {
          return true;
        }

        // 3. Try to refresh tokens
        if (refreshToken) {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
              { refreshToken },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            const { accessToken: newAccess, refreshToken: newRefresh } =
              res.data;
            setTokens(newAccess, newRefresh);
            return true;
          } catch (error) {
            console.error("Token refresh failed:", error);
            clearTokens();
            return false;
          }
        }

        // 4. Default case - no valid tokens
        clearTokens();
        return false;
      },

      login: async (email, password) => {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
          { email, password }
        );

        const { accessToken, refreshToken, user } = res.data;
        set({ user, accessToken, refreshToken });
      },

      logout: () => {
        // Clear tokens first to prevent any API calls during logout
        get().clearTokens();
        set({ user: null });
      },

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),

      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
