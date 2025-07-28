import { Navigate, Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import { PrivateRoute } from "./route/PrivateRoute";
import LoginPage from "./pages/login";
import { isTokenExpired, useAuthStore } from "./store/authStore";
import { useEffect } from "react";

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

      {/* private routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<IndexPage />} path="/" />
        <Route path="/docs" element={<DocsPage />} />
      </Route>

      {/* Catch-all: optional */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
