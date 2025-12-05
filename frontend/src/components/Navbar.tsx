import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { NotificationBell } from "./NotificationBell";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="flex w-full h-[73px] items-center px-4 fixed top-0 left-0 bg-white border-b z-10">
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Podcasty Logo" className="w-14 h-14 object-contain" />
          </button>
          <button onClick={() => navigate("/browse")} className="text-gray-600">
            Browse
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notification Bell */}
              <NotificationBell />

              <button onClick={() => navigate("/library")} className="text-sm hover:text-gray-600">
                My Library
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity overflow-hidden"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {user.userName ? user.userName[0].toUpperCase() : "P"}
                  </div>
                )}
              </button>
              <button onClick={logout} className="text-sm text-red-600 hover:text-red-800">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Login
              </button>
              <button onClick={() => navigate("/signup")} className="px-4 py-2 bg-[#8b22b0] text-white rounded-lg hover:bg-[#7a1d9c]">
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};