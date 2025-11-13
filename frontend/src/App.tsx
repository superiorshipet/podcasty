import React from "react";
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
// import { Category } from "./screens/Category/Category";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <Navbar />
      
      <main className="flex-1 pt-[73px] pb-20">
        <Routes>
          
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/podcast/:podcastId" element={<Podcast />} />
          {/* <Route path="/category/:categoryId" element={<Category />} /> */}

          
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            {/* <Route path="/my-library" element={<MyLibrary />} /> */}
          </Route>
        </Routes>
      </main>
      
      <GlobalPlayer />
      <Footer />
      <LoginPromptModal />
    </div>
  );
}

export default App;