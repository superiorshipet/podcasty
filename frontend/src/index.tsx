import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import { PlayerProvider } from "./contexts/PlayerContext"; // استدعاء مزود مشغل الصوت

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    {/* (هام) قمنا بقلب الترتيب 
      PlayerProvider يغلف AuthProvider
      هذا يسمح للـ AuthContext باستهلاك (use) الـ PlayerContext
    */}
    <PlayerProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </PlayerProvider>
  </StrictMode>
);