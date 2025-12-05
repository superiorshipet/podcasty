import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, LoginData, SignupData, UpdateUserData, PasswordChangeData } from "../types";
import { usePlayer } from "./PlayerContext";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateUserData) => Promise<void>;
  changePassword: (data: PasswordChangeData) => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string) {
  try {
    if (!token || token.split('.').length !== 3) return null;
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { clearPlayer } = usePlayer();

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("podcasty_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem("podcasty_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Fetch full profile from database
  const fetchFullProfile = async (basicUser: User): Promise<User> => {
    try {
      const profile = await api.profile.get();
      if (profile) {
        return {
          ...basicUser,
          userName: profile.userName || basicUser.userName,
          email: profile.email || basicUser.email,
          role: profile.role || basicUser.role,
          profilePicture: profile.profilePicture,
          bio: profile.bio,
        };
      }
    } catch (e) {
      console.error("Failed to fetch full profile:", e);
    }
    return basicUser;
  };

  const login = async (data: LoginData) => {
    const response = await api.auth.login(data);

    let token = null;

    if (response && typeof response === 'object') {
      token = response.token || response.Token;
    } else if (typeof response === 'string') {
      token = response;
    }

    if (token) {
      localStorage.setItem("podcasty_token", token);
      const decoded = parseJwt(token);
      if (decoded) {
        const basicUser: User = {
          id: parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.nameid || decoded.sub),
          userName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.unique_name || decoded.name,
          email: data.userName,
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role,
          token: token
        };

        // Fetch full profile from database to get profilePicture, bio, etc.
        const fullUser = await fetchFullProfile(basicUser);

        localStorage.setItem("podcasty_user", JSON.stringify(fullUser));
        setUser(fullUser);
      }
    } else {
      throw new Error("Login failed: Invalid response from server.");
    }
  };

  const signup = async (data: SignupData) => {
    await api.auth.register(data);
    await login({ userName: data.userName, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem("podcasty_token");
    localStorage.removeItem("podcasty_user");
    setUser(null);
    clearPlayer();
  };

  const updateProfile = async (data: UpdateUserData) => {
    if (!user) return;
    await api.profile.update(data);

    // Map the update data to user object fields
    const updatedUser: User = {
      ...user,
      userName: data.name || user.userName,
      profilePicture: data.profilePicture || user.profilePicture,
      bio: data.bio !== undefined ? data.bio : user.bio,
    };

    // Save to localStorage so data persists after refresh
    localStorage.setItem("podcasty_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const changePassword = async (_data: PasswordChangeData) => {
    // TODO: Implement password change API call
  };

  return (
    <AuthContext.Provider
      value={{
        user, isLoading, login, signup, logout, updateProfile, changePassword,
        isLoginModalOpen, openLoginModal, closeLoginModal,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};