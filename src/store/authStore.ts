import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface AuthState {
  user: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}

interface JwtPayload {
  exp: number;
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    return true;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      isAuthenticated: false,

      login: async (email, password) => {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
          { email, password }
        );

        const { accessToken, refreshToken } = res.data;

        set({
          accessToken,
          isAuthenticated: true,
          refreshToken,
        });
      },

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
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
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
