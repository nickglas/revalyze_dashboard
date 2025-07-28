import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import { PrivateRoute } from "./route/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<PrivateRoute />}>
        <Route path="/docs" element={<DocsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
