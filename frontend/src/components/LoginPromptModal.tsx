import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const LoginPromptModal = () => {
  const { isLoginModalOpen, closeLoginModal } = useAuth();
  const navigate = useNavigate();

  if (!isLoginModalOpen) {
    return null;
  }

  const handleLogin = () => {
    closeLoginModal();
    navigate("/login");
  };

  return (
    // --- Overlay ---
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={closeLoginModal}
    >
      {/* --- Modal Content --- */}
      <div
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4 transform transition-all duration-300 ease-in-out scale-100"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-2xl font-bold text-neutral-950 [font-family:'Arimo',Helvetica] mb-4">
          Login Required
        </h2>
        <p className="text-base text-gray-600 [font-family:'Arimo',Helvetica] mb-6">
          You need to be logged in to use this feature.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={closeLoginModal}
            className="all-[unset] box-border h-10 px-4 py-2 rounded-lg bg-gray-100 text-neutral-950 cursor-pointer [font-family:'Arimo',Helvetica] font-medium transition-all duration-200 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            className="all-[unset] box-border h-10 px-4 py-2 rounded-lg bg-[#030213] text-white cursor-pointer [font-family:'Arimo',Helvetica] font-medium transition-all duration-200 hover:bg-opacity-80"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};