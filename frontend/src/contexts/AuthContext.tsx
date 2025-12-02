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
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
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

  useEffect(() => {
    const token = localStorage.getItem("podcasty_token");
    if (token && token !== "undefined" && token !== "null") {
        const decoded = parseJwt(token);
        if (decoded) {
            setUser({
                id: parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.nameid || decoded.sub),
                userName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.unique_name || decoded.name,
                email: "", 
                role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role,
                token: token
            });
        } else {
            localStorage.removeItem("podcasty_token");
        }
    }
    setIsLoading(false);
  }, []);

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
            setUser({
                id: parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.nameid || decoded.sub),
                userName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.unique_name || decoded.name,
                email: data.userName, 
                role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role,
                token: token
            });
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
    setUser(null);
    clearPlayer();
  };

  const updateProfile = async (data: UpdateUserData) => {
    if (!user) return;
    await api.profile.update(data);
    setUser({ ...user, ...data } as User);
  };
  
  const changePassword = async (data: PasswordChangeData) => {
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