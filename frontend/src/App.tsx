import { Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GlobalPlayer } from "./components/GlobalPlayer";
import { Footer } from "./components/Footer";
import { LoginPromptModal } from "./components/LoginPromptModal";

import { LandingPage } from "./screens/LandingPage/LandingPage";
import { Login } from "./screens/Login/Login";
import { Signup } from "./screens/Signup/Signup";
import { Browse } from "./screens/Browse/Browse";
import { Podcast } from "./screens/Podcast/Podcast";
import { Profile } from "./screens/Profile/Profile";
import { EditProfile } from "./screens/EditProfile/EditProfile";
import { CreatorDashboard } from "./screens/CreatorDashboard/CreatorDashboard";
import { AdminDashboard } from "./screens/Admin/AdminDashboard"; 
import { MyLibrary } from "./screens/MyLibrary";

function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-neutral-950">
      <Navbar />
      {/* pt-[73px] accounts for fixed navbar height */}
      <main className="flex-1 pt-[73px] pb-24"> 
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/podcast/:podcastId" element={<Podcast />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/library" element={<MyLibrary />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<div className="p-20 text-center text-xl">404 - Page Not Found</div>} />
        </Routes>
      </main>
      
      {/* Player persists across pages */}
      <GlobalPlayer />
      <Footer />
      <LoginPromptModal />
    </div>
  );
}
export default App;