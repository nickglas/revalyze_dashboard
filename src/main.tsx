import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App.tsx";
import { Provider } from "./provider.tsx";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <main className="extended-dark text-foreground bg-background w-full h-[100vh]">
          <App />
        </main>
        <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
