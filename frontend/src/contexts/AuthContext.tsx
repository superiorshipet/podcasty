import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>; 
  signup: (username: string, email: string, password: string) => Promise<void>; 
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // const userData = await api.verifyToken(token);
      // setUser(userData);
      setUser({
        id: "1",
        username: "johndoe",
        email: "johndoe@example.com",
        initial: "J",
        avatarUrl: "https://placehold.co/100x100/E2E8F0/4A5568?text=J",
        bio: "Podcast enthusiast. Tech lover."
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // const response = await api.post('/login', { email, password });
    // const { token, user } = response.data;
    // localStorage.setItem("token", token);
    
    await new Promise(res => setTimeout(res, 500));
    const token = "mock_token_from_login";
    localStorage.setItem("token", token);

    setUser({
      id: "1",
      username: "johndoe_logged_in", 
      email: email,
      initial: "J",
      avatarUrl: "https://placehold.co/100x100/E2E8F0/4A5568?text=J",
      bio: "Podcast enthusiast. Tech lover."
    });
  };

  // --- (3) تعديل دالة signup ---
  const signup = async (username: string, email: string, password: string) => {
    // const response = await api.post('/signup', { username, email, password });
    // const { token, user } = response.data;
    // localStorage.setItem("token", token);
    
    await new Promise(res => setTimeout(res, 500)); 
    const token = "mock_token_from_signup"; 
    localStorage.setItem("token", token);

    const initial = username.charAt(0).toUpperCase() || "P";
    setUser({
      id: "2",
      username: username,
      email: email,
      initial: initial,
      avatarUrl: `https://placehold.co/100x100/E2E8F0/4A5568?text=${initial}`,
      bio: "A new user!"
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};