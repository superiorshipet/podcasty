import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// (1) استدعاء الـ Providers التي أنشأناها
import { AuthProvider } from "./contexts/AuthContext";
import { PlayerProvider } from "./contexts/PlayerContext";

// (2) حذف الأقواس الفارغة التي كانت موجودة
createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    {/* (3) تغليف التطبيق بالكامل بالـ Providers */}
    {/* هذا يضمن أن أي Component (مثل Navbar) يمكنه الوصول لبيانات المستخدم والصوت */}
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  </StrictMode>
);