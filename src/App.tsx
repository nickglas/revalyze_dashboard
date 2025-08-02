import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { isTokenExpired, useAuthStore } from "./store/authStore";

// Auth-related pages
import LoginPage from "./pages/public/login";
import ForgotPasswordPage from "./pages/public/forgotPassword";
import ResetPasswordPage from "./pages/public/resetPassword";
import ActivateAccountPage from "./pages/public/activateAccount";

// Layout
import DashboardLayout from "./layouts/default";

// CMS pages
import DashboardPage from "./pages/private/dashboard";
import Users from "./pages/private/users";
import TranscriptsPage from "./pages/private/transcripts";
import ReviewsPage from "./pages/private/reviews";
import ReviewConfigPage from "./pages/private/reviewConfigs";
import ExternalCompaniesPage from "./pages/private/externalCompanies";
import CompanyPage from "./pages/private/company";
import ExternalContactsPage from "./pages/private/externalContacts";
import CriteriaPage from "./pages/private/criteria";
import EmployeeInsightsPage from "./pages/private/employeeInsight";
import TeamInsightsPage from "./pages/private/teamInsight";

// Placeholder components for routes not yet implemented
const Placeholder = ({ name }: { name: string }) => (
  <div className="p-4 text-xl text-center">📄 {name} Page</div>
);

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

      {/* Private routes inside layout */}
      <Route path="/" element={<DashboardLayout />}>
        {/* Dashboards */}
        <Route index element={<DashboardPage />} />
        <Route path="employee-insights" element={<EmployeeInsightsPage />} />
        <Route path="team-insights" element={<TeamInsightsPage />} />

        {/* Conversation Analysis */}
        <Route path="transcripts" element={<TranscriptsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="review-configs" element={<ReviewConfigPage />} />
        <Route path="criteria" element={<CriteriaPage />} />

        {/* Client Management */}
        <Route path="external-companies" element={<ExternalCompaniesPage />} />
        <Route path="contacts" element={<ExternalContactsPage />} />

        {/* Company Administration */}
        <Route path="company" element={<CompanyPage />} />
        <Route path="users" element={<Users />} />
        <Route
          path="subscriptions"
          element={<Placeholder name="Subscriptions" />}
        />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
