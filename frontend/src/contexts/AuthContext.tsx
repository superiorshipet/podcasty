import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
// (1) استدعاء الأنواع الجديدة
import { User, LoginData, SignupData, UpdateUserData, PasswordChangeData } from "../types";

// (2) تحديث الـ Type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>; // <-- تعديل
  logout: () => void;
  updateProfile: (data: UpdateUserData) => Promise<void>;
  changePassword: (data: PasswordChangeData) => Promise<void>;
  
  // (State للـ Modal)
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // (مهم للـ Protected Routes)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // (محاكاة) التحقق من الـ Token عند بدء تشغيل التطبيق
  useEffect(() => {
    const checkUser = async () => {
      // const token = localStorage.getItem("token");
      // if (token) {
      //   try {
      //     // const apiUser = await fetch("/api/me", { headers: { 'Authorization': `Bearer ${token}` }});
      //     // setUser(apiUser.json());
      //   } catch (e) {
      //     localStorage.removeItem("token");
      //   }
      // }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  // --- دوال الـ Auth ---

  const login = async (data: LoginData) => {
    console.log("Login attempt with:", data.email);
    // (محاكاة) استدعاء الـ API
    await new Promise((res) => setTimeout(res, 1000));

    // (محاكاة) خطأ في الدخول
    if (data.password === "wrong") {
      throw new Error("Invalid email or password.");
    }

    // (محاكاة) نجاح الدخول
    const mockUser: User = {
      id: "user-123",
      username: "userTest",
      email: data.email,
      firstName: "user", // <-- بيانات وهمية
      lastName: "test",  // <-- بيانات وهمية
      initial: "J",     // <-- بيانات وهمية
      bio: "This is a mock bio.",
      avatarUrl: ""
    };

    setUser(mockUser);
    // localStorage.setItem("token", "mock-token-12345");
    console.log("Login successful");
  };

  const signup = async (data: SignupData) => { // <-- (3) تعديل الدالة
    console.log("Signup attempt with:", data);
    // (محاكاة) استدعاء الـ API
    await new Promise((res) => setTimeout(res, 1000));

    // (محاكاة) خطأ (الإيميل مستخدم)
    if (data.email === "used@example.com") {
      throw new Error("This email is already in use.");
    }

    // (محاكاة) نجاح التسجيل
    const newUser: User = {
      id: `user-${Math.floor(Math.random() * 1000)}`, // (من الـ API)
      username: data.username,
      email: data.email,
      firstName: data.firstName, // <-- (4) استخدام البيانات الجديدة
      lastName: data.lastName,   // <-- (4) استخدام البيانات الجديدة
      initial: data.firstName[0].toUpperCase(), // <-- (5) Initial ذكي
      bio: `Welcome to Podstream, ${data.firstName}!`,
      avatarUrl: ""
    };

    setUser(newUser);
    // localStorage.setItem("token", "mock-token-54321");
    console.log("Signup successful");
  };

  const logout = () => {
    console.log("Logging out");
    setUser(null);
    // localStorage.removeItem("token");
    // (يمكن إضافة navigate("/") هنا إذا أردت)
  };

  const updateProfile = async (data: UpdateUserData) => {
    if (!user) return;
    console.log("Updating profile with:", data);
    await new Promise((res) => setTimeout(res, 1000));

    // (محاكاة) تحديث المستخدم
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    console.log("Profile updated");
  };
  
  const changePassword = async (data: PasswordChangeData) => {
    console.log("Changing password...");
    await new Promise((res) => setTimeout(res, 1000));

    if (data.currentPassword === "wrong") {
      throw new Error("Incorrect current password.");
    }
    
    console.log("Password changed successfully");
    // (لا نحتاج لتحديث الـ state هنا)
  };


  // --- دوال الـ Modal ---
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);


  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};