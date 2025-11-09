import { Routes, Route } from "react-router-dom";

// 1. قم باستدعاء (Import) لكل صفحاتك هنا
import { LandingPage } from "./screens/LandingPage"; 
import { Login } from "./screens/Login";

function App() {
  return (
    // 2. عرف المسارات (Routes) هنا
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;