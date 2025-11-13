import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LoginData } from "../../types"; // <-- (1) استدعاء الـ Type

export const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth(); // استدعاء دالة الدخول من الـ Context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // (2) التعديل الأهم: إرسال البيانات كـ "أوبجكت"
      const loginData: LoginData = { email, password };
      await login(loginData);
      
      navigate("/profile"); // بعد النجاح، اذهب للبروفايل
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex items-center justify-center pt-12">
      {/* تم حذف الـ Navbar المكرر من هنا.
          الـ Navbar العالمي من App.tsx سيظهر بدلاً منه.
      */}
      <div className="flex flex-col w-full max-w-md items-start gap-6 p-6 bg-white rounded-lg border-[0.8px] border-solid border-[#0000001a] shadow-md m-4">
        
        {/* --- Header --- */}
        <div className="w-full">
          <h1 className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-xl tracking-[0] leading-4">
            Login
          </h1>
          <p className="mt-2 [font-family:'Arimo',Helvetica] font-normal text-[#717182] text-base tracking-[0] leading-6">
            Enter your credentials to access your account
          </p>
        </div>

        {/* --- Form --- */}
        <form className="flex flex-col w-full items-start gap-4" onSubmit={handleSubmit}>
          
          <div className="flex-col h-auto items-start self-stretch w-full flex relative">
            <label
              className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-sm"
              id="email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex-col h-auto items-start self-stretch w-full flex relative">
            <label
              className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-sm"
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* --- Error Message --- */}
          {error && (
            <div className="text-red-500 text-sm [font-family:'Arimo',Helvetica]">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="all-[unset] box-border bg-[#030213] relative self-stretch w-full h-9 rounded-lg text-white text-center [font-family:'Arimo',Helvetica] disabled:opacity-50 transition-opacity hover:bg-opacity-90"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        {/* --- Link to Signup --- */}
        <div className="h-5 relative self-stretch w-full text-center">
          <span className="[font-family:'Arimo',Helvetica] font-normal text-[#495565] text-sm tracking-[0]">
            Don't have an account?{" "}
          </span>
          <button
            onClick={() => navigate("/signup")}
            className="[font-family:'Arimo',Helvetica] font-normal text-[#155cfb] text-sm hover:underline"
          >
            Sign up
          </button>
        </div>

      </div>
    </div>
  );
};