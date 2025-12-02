import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LoginData } from "../../types";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userName, setUserName] = useState(""); // <-- تغير الاسم
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (!userName || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const loginData: LoginData = { userName, password }; 
      await login(loginData);
      navigate("/profile"); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex items-center justify-center pt-12">
      <div className="flex flex-col w-[446px] items-start gap-6 p-6 bg-white rounded-lg border-[0.8px] border-solid border-[#0000001a] shadow-md">
        
        <div className="w-full">
          <h1 className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-xl tracking-[0] leading-4">
            Login
          </h1>
          <p className="mt-2 [font-family:'Arimo',Helvetica] font-normal text-[#717182] text-base tracking-[0] leading-6">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="flex flex-col w-full items-start gap-4" onSubmit={handleSubmit}>
          
          <div className="flex-col h-[50px] items-start self-stretch w-full flex relative">
            <label
              className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm mb-1"
              htmlFor="username"
            >
              Username {/* <-- تم التعديل */}
            </label>
            <input
              className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-sm"
              id="username"
              placeholder="Enter your username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="flex-col h-[50px] items-start self-stretch w-full flex relative">
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
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm [font-family:'Arimo',Helvetica]">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="all-[unset] box-border bg-[#030213] relative self-stretch w-full h-9 rounded-lg text-white text-center [font-family:'Arimo',Helvetica] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="h-5 relative self-stretch w-full text-center">
          <span className="[font-family:'Arimo',Helvetica] font-normal text-[#495565] text-sm tracking-[0]">
            Don't have an account?{" "}
          </span>
          <button
            onClick={() => navigate("/signup")}
            className="[font-family:'Arimo',Helvetica] font-normal text-[#155cfb] text-sm"
          >
            Sign up
          </button>
        </div>

      </div>
    </div>
  );
};