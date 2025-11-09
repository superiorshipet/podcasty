import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // 1. سنستدعي ملف App

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    {/* 2. يجب إحاطة التطبيق بـ BrowserRouter */}
    <BrowserRouter>
      <App /> {/* 3. اعرض الـ App (الذي يحتوي على الـ Router) */}
    </BrowserRouter>
  </StrictMode>
);