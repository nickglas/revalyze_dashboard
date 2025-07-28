import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:4500" : "", // Adjust prod URL if needed
  withCredentials: true,
});

// Token injection
api.interceptors.request.use(
  (config) => {
    const { accessToken, refreshToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "/api/v1/auth/refresh",
          { refreshToken },
          { baseURL: import.meta.env.DEV ? "http://localhost:4500" : "" }
        );

        toast.info("Perfing refresh");

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          res.data;
        setTokens(newAccessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        toast.success("Refresh successfull");

        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        toast.error("Invalid refresh token");
        window.location.href = "/login"; // redirect on failure
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
