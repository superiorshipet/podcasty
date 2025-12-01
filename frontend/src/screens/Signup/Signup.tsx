import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { SignupData } from "../../types"; // <-- (1) استدعاء الـ Type الجديد

export const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth(); 

  // (2) تحديث الـ State ليحتوي على الحقول الجديدة
  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  
  const [error, setError] = useState<string | null>(null);

  // دالة موحدة لتحديث الفورم
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // (3) التحقق من الحقول الجديدة
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      // (4) إرسال الأوبجكت المكتمل
      await signup(formData); 
      navigate("/profile"); // بعد النجاح، اذهب للبروفايل
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex items-center justify-center pt-12">
      <div className="flex flex-col w-full max-w-md items-start gap-6 p-6 bg-white rounded-lg border-[0.8px] border-solid border-[#0000001a] shadow-md m-4">
        
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
          {/* --- (5) إضافة حقل First Name --- */}
          <div className="flex-col h-auto items-start self-stretch w-full flex relative">
            <label
              className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm mb-1"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-sm"
              id="firstName"
              name="firstName"
              placeholder="John"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          {/* --- (6) إضافة حقل Last Name --- */}
          <div className="flex-col h-auto items-start self-stretch w-full flex relative">
            <label
              className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm mb-1"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-sm"
              id="lastName"
              name="lastName"
              placeholder="Doe"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* --- حقل Username --- */}
          <div className="flex-col h-auto items-start self-stretch w-full flex relative">
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
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* --- حقل Email --- */}
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
              name="email"
              placeholder="you@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* --- حقل Password --- */}
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
              name="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
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
            className="all-[unset] box-border bg-[#030213] relative self-stretch w-full h-9 rounded-lg text-white text-center [font-family:'Arimo',Helvetica] disabled:opacity-50 transition-opacity hover:bg-opacity-90"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="relative self-stretch w-full h-5 text-center">
          <p className="[font-family:'Arimo',Helvetica] font-normal text-[#495565] text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="[font-family:'Arimo',Helvetica] font-normal text-[#155cfb] text-sm hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};