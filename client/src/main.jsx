import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { NotificacionProvider } from "./context/NotificacionContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <NotificacionProvider>
        <App />
      </NotificacionProvider>
    </AuthProvider>
  </StrictMode>
);
