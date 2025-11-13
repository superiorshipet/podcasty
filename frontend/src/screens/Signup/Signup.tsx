import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth(); // استدعاء دالة التسجيل من الـ Context

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      await signup(username, email, password);
      navigate("/profile"); 
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex items-center justify-center pt-12">
      {}
      <div className="flex flex-col w-[446px] items-start gap-6 p-6 bg-white rounded-lg border-[0.8px] border-solid border-[#0000001a] shadow-md">
        
        <header className="w-full">
          <h1 className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-xl tracking-[0] leading-4">
            Sign Up
          </h1>
          <p className="mt-2 [font-family:'Arimo',Helvetica] font-normal text-[#717182] text-base tracking-[0] leading-6">
            Create an account to start listening
          </p>
        </header>

        <form
          className="flex flex-col w-full items-start gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex-col h-[50px] items-start self-stretch w-full flex relative">
            <label
              className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-sm"
              id="email"
              name="email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex-col h-[50px] items-start self-stretch w-full flex relative">
            <label
              className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-sm"
              id="username"
              name="username"
              placeholder="johndoe"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
              name="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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
            className="all-[unset] box-border bg-[#030213] relative self-stretch w-full h-9 rounded-lg text-white text-center [font-family:'Arimo',Helvetica] disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="relative self-stretch w-full h-5 text-center">
          <p className="[font-family:'Arimo',Helvetica] font-normal text-[#495565] text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="[font-family:'Arimo',Helvetica] font-normal text-[#155cfb] text-sm"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};