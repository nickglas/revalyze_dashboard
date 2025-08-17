// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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
import EmployeeInsightsPage from "./pages/private/employeeInsight";
import TeamInsightsPage from "./pages/private/teamInsight";
import TranscriptsPage from "./pages/private/transcripts";
import ReviewsPage from "./pages/private/reviews";
import ReviewConfigsPage from "./pages/private/reviewConfigs";
import CriteriaPage from "./pages/private/criteria";
import ExternalCompaniesPage from "./pages/private/externalCompanies";
import ExternalContactsPage from "./pages/private/externalContacts";
import CompanyPage from "./pages/private/company";
import TeamsPage from "./pages/private/teams";
import CompanyDashboardPage from "./pages/private/GeneralOverview";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/activate-account" element={<ActivateAccountPage />} />

      {/* Protected routes */}
      {isAuthenticated ? (
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="employee-insights" element={<EmployeeInsightsPage />} />
          <Route path="team-insights" element={<TeamInsightsPage />} />
          <Route path="transcripts" element={<TranscriptsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="review-configs" element={<ReviewConfigsPage />} />
          <Route path="criteria" element={<CriteriaPage />} />
          <Route
            path="external-companies"
            element={<ExternalCompaniesPage />}
          />
          <Route path="contacts" element={<ExternalContactsPage />} />
          <Route path="company" element={<CompanyPage />} />
          <Route path="users" element={<Users />} />
          <Route path="teams" element={<TeamsPage />} />
        </Route>
      ) : null}

      {/* Redirects */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
