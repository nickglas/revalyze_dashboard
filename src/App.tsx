import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import { isTokenExpired, useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ForgotPasswordPage from "./pages/forgotPassword";
import ActivateAccountPage from "./pages/activateAccount";
import ResetPasswordPage from "./pages/resetPassword";
import DashboardLayout from "./layouts/default";
import DashboardPage from "./pages/DashboardPage";
import Users from "./pages/users";
import TranscriptsPage from "./pages/transcripts";

function App() {
  const { accessToken, logout } = useAuthStore();

  useEffect(() => {
    if (isTokenExpired(accessToken)) {
      logout();
    }
  }, [accessToken]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/activate-account" element={<ActivateAccountPage />} />

      {/* private routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<Users />} />
        <Route path="transcripts" element={<TranscriptsPage />} />
        {/* <Route path="settings" element={<SettingsPage />} /> */}
      </Route>

      {/* Catch-all: optional */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
