import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import { setupGlobalErrorHandling } from "./lib/errorMonitoring";

// Initialize global error monitoring
setupGlobalErrorHandling();

const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
  } catch (error) {
    console.error("Failed to render app:", error);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0b; color: #fff; font-family: system-ui, sans-serif; padding: 2rem; text-align: center;">
        <div>
          <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Unable to load application</h1>
          <p style="color: #888; margin-bottom: 1.5rem;">Please try refreshing the page or clearing your browser cache.</p>
          <button onclick="window.location.reload()" style="background: #ea580c; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 9999px; cursor: pointer; font-weight: 500;">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
} else {
  console.error("Root element not found");
}
