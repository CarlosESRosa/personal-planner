import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AlertProvider } from "./components/ui/AlertProvider";

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlertProvider>
      <App />
    </AlertProvider>
  </StrictMode>
);
