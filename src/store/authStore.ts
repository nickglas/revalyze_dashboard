import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { isTokenExpired } from "@/util/jwt";
import { useCompanyStore } from "./companyStore";
import { useContactStore } from "./contactStore";
import { useCriteriaStore } from "./criteriaStore";
import { useExternalCompanyStore } from "./externalCompanyStore";
import { usePlanStore } from "./planStore";
import { useReviewConfigStore } from "./reviewConfigStore";
import { useReviewStore } from "./reviewStore";
import { useTeamStore } from "./teamStore";
import { useTranscriptStore } from "./transcriptStore";
import { useUserStore } from "./userStore";

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

        if (!accessToken && !refreshToken) {
          return false;
        }

        if (accessToken && !isTokenExpired(accessToken)) {
          return true;
        }

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
        get().clearTokens();
        set({ user: null });

        useCompanyStore.getState().reset();
        useContactStore.getState().reset();
        useCriteriaStore.getState().reset();
        useExternalCompanyStore.getState().reset();
        usePlanStore.getState().reset();
        useReviewConfigStore.getState().reset();
        useReviewStore.getState().reset();
        useTeamStore.getState().reset();
        useTranscriptStore.getState().reset();
        useUserStore.getState().reset();
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
