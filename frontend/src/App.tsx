import { Routes, Route } from "react-router-dom";

// 1. قم باستدعاء (Import) لكل صفحاتك هنا
import { LandingPage } from "./screens/LandingPage"; 
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import { Browse } from "./screens/Browse"; // <-- تمت إضافته
import { EditProfile } from "./screens/EditProfile"; // <-- تمت إضافته
import { Category } from "./screens/Category"; // <-- تمت إضافته
import { Profile } from "./screens/Profile"; // <-- تمت إضافته
import { Podcast } from "./screens/Podcast"; // <-- تمت إضافته

function App() {
  return (
    // 2. عرف المسارات (Routes) هنا
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* --- المسارات الجديدة --- */}
      <Route path="/browse" element={<Browse />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/category" element={<Category />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/podcast" element={<Podcast />} />
    </Routes>
  );
}

export default App;