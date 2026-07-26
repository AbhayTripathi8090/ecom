import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./providers";
import App from "./App";
import "../index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>
  );
}
