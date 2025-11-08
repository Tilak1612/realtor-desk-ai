import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import { setupGlobalErrorHandling } from "./lib/errorMonitoring";

// Initialize global error monitoring
setupGlobalErrorHandling();

createRoot(document.getElementById("root")!).render(<App />);
