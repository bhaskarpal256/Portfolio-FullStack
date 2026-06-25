import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import "./services/interceptor.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <div class="crt-shell">
          <div class="crt-glass"></div>
          <div class="crt-glare"></div>

          <div class="crt-content">

                <App />
              </div>
            </div>

      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
