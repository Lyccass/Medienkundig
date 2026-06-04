import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { ProgressProvider } from "./store/ProgressContext";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </StrictMode>
);
