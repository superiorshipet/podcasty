import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { SignupData } from "../../types";

export const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setError("Username, Email, and Password are required.");
      setIsLoading(false);
      return;
    }

    try {
      const apiData: SignupData = {
        userName: formData.username,
        email: formData.email,
        password: formData.password
      };

      await signup(apiData);
      navigate("/profile");
    } catch (err: any) {
      let displayMessage = "Registration failed.";

      if (Array.isArray(err)) {
        displayMessage = err.map((e: any) => e.description).join(', ');
      }
      else if (err && err.message) {
        try {
          const parsedError = JSON.parse(err.message);
          if (Array.isArray(parsedError) && parsedError.length > 0 && parsedError[0].description) {
            displayMessage = parsedError.map((e: any) => e.description).join(', ');
          } else {
            displayMessage = err.message;
          }
        } catch (e) {
          displayMessage = err.message;
        }
      }

      setError(displayMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white w-full min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col w-full max-w-[446px] items-center gap-6">
        {/* Banner */}
        <img
          src="/images/banner.png"
          alt="Podcasty Banner"
          className="w-64 h-auto object-contain"
        />

        {/* Form Card */}
        <div className="flex flex-col w-full items-start gap-6 p-6 bg-white rounded-lg border-[0.8px] border-solid border-[#0000001a] shadow-md">

          <header className="w-full">
            <h1 className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-xl tracking-[0] leading-4">
              Sign Up
            </h1>
            <p className="mt-2 [font-family:'Arimo',Helvetica] font-normal text-[#717182] text-base tracking-[0] leading-6">
              Create an account to start listening
            </p>
          </header>

          <form className="flex flex-col w-full items-start gap-4" onSubmit={handleSubmit}>

            <div className="flex gap-2 w-full">
              <div className="flex-col h-auto items-start w-1/2 flex relative">
                <label className="text-sm mb-1">First Name</label>
                <input className="h-9 px-3 w-full bg-[#f3f3f5] rounded-lg text-sm" name="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="flex-col h-auto items-start w-1/2 flex relative">
                <label className="text-sm mb-1">Last Name</label>
                <input className="h-9 px-3 w-full bg-[#f3f3f5] rounded-lg text-sm" name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="flex-col h-auto items-start self-stretch w-full flex relative">
              <label className="text-sm mb-1">Username</label>
              <input className="h-9 px-3 w-full bg-[#f3f3f5] rounded-lg text-sm" name="username" value={formData.username} onChange={handleChange} required />
            </div>

            <div className="flex-col h-auto items-start self-stretch w-full flex relative">
              <label className="text-sm mb-1">Email</label>
              <input className="h-9 px-3 w-full bg-[#f3f3f5] rounded-lg text-sm" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="flex-col h-auto items-start self-stretch w-full flex relative">
              <label className="text-sm mb-1">Password</label>
              <input className="h-9 px-3 w-full bg-[#f3f3f5] rounded-lg text-sm" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button type="submit" disabled={isLoading} className="all-[unset] box-border bg-[#8b22b0] relative self-stretch w-full h-9 rounded-lg text-white text-center cursor-pointer disabled:opacity-50 hover:bg-[#7a1d9c]">
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="relative self-stretch w-full h-5 text-center">
            <p className="text-[#495565] text-sm">
              Already have an account? <button onClick={() => navigate("/login")} className="text-[#155cfb]">Login</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};