import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

interface AuthState {
  user: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
          { email, password }
        );

        const { user, accessToken } = res.data;

        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
