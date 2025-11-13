import React, { useState } from "react";
import { ChangeEvent, FormEvent, FC } from "react";

interface FormData {
  email: string;
  username: string;
  password: string;
}

export const Signup: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleLoginClick = () => {
    console.log("Navigate to login");
  };

  const handleSignUpNavClick = () => {
    console.log("Navigate to sign up");
  };

  const handleBrowseClick = () => {
    console.log("Navigate to browse");
  };

  return (
    <div
      className="bg-white w-full min-w-[1144px] min-h-[717px] relative"
      data-model-id="1:977"
    >
      <div className="flex flex-col w-[1144px] h-[717px] items-start gap-6 pl-[348px] pr-0 pt-[150.15px] pb-0 absolute top-0 left-0 bg-white rounded-[14px] border-[0.8px] border-solid border-[#0000001a]">
        <header className="relative w-[446.4px] h-[70px]">
          <div className="absolute top-6 left-6 w-[398px] h-4 flex">
            <h1 className="mt-[-2.2px] w-[57px] h-4 [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-4 whitespace-nowrap">
              Sign Up
            </h1>
          </div>

          <div className="absolute top-[46px] left-6 w-[398px] h-6 flex">
            <p className="mt-[-2.2px] w-[248px] h-6 [font-family:'Arimo',Helvetica] font-normal text-[#717182] text-base tracking-[0] leading-6 whitespace-nowrap">
              Create an account to start listening
            </p>
          </div>
        </header>

        <form
          className="flex flex-col w-[446.4px] h-[294px] items-start gap-4 px-6 py-0 relative"
          onSubmit={handleSubmit}
        >
          <div className="relative self-stretch w-full h-[234px]">
            <div className="flex flex-col w-[398px] h-[50px] items-start gap-[1.53e-05px] absolute top-0 left-0">
              <div className="flex h-3.5 items-center gap-2 relative self-stretch w-full">
                <label
                  className="relative w-fit mt-[-1.00px] [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-[14px] whitespace-nowrap"
                  htmlFor="input-1"
                >
                  Email
                </label>
              </div>

              <input
                className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg overflow-hidden border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-[#717182] text-sm tracking-[0] leading-[normal] whitespace-nowrap focus:border-[#155cfb] focus:outline-none transition-colors"
                id="input-1"
                name="email"
                placeholder="you@example.com"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                aria-required="true"
              />
            </div>

            <div className="flex flex-col w-[398px] h-[50px] items-start absolute top-[66px] left-0">
              <div className="flex h-3.5 items-center gap-2 relative self-stretch w-full">
                <label
                  className="relative w-fit mt-[-1.00px] [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-[14px] whitespace-nowrap"
                  htmlFor="input-username"
                >
                  Username
                </label>
              </div>

              <input
                className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg overflow-hidden border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-[normal] whitespace-nowrap focus:border-[#155cfb] focus:outline-none transition-colors"
                id="input-username"
                name="username"
                placeholder="johndoe"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
                aria-required="true"
              />
            </div>

            <div className="flex flex-col w-[398px] h-[50px] items-start absolute top-[132px] left-0">
              <div className="flex h-3.5 items-center gap-2 relative self-stretch w-full">
                <label
                  className="relative w-fit mt-[-1.00px] [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-[14px] whitespace-nowrap"
                  htmlFor="input-2"
                >
                  Password
                </label>
              </div>

              <input
                className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg overflow-hidden border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-[normal] whitespace-nowrap focus:border-[#155cfb] focus:outline-none transition-colors"
                id="input-2"
                name="password"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                aria-required="true"
                minLength={8}
              />
            </div>

            <button
              type="submit"
              className="all-[unset] box-border absolute top-[198px] left-0 w-[398px] flex bg-[#030213] h-9 rounded-lg cursor-pointer hover:bg-[#0a0a1f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#155cfb] focus:ring-offset-2"
              aria-label="Sign up for an account"
            >
              <span className="mt-[6.8px] w-[50px] h-5 ml-[174.2px] [font-family:'Arimo',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                Sign Up
              </span>
            </button>
          </div>

          <div className="relative self-stretch w-full h-5">
            <p className="absolute -top-px left-[101px] w-[162px] [font-family:'Arimo',Helvetica] font-normal text-[#495565] text-sm text-center tracking-[0] leading-5">
              Already have an account?
            </p>

            <div className="flex w-[34px] h-[18px] items-start absolute top-px left-[263px]">
              <button
                type="button"
                onClick={handleLoginClick}
                className="relative w-fit mt-[-1.00px] mb-[-0.60px] mr-[-0.64px] text-[#155cfb] text-center [font-family:'Arimo',Helvetica] font-normal text-sm tracking-[0] leading-5 whitespace-nowrap cursor-pointer hover:underline focus:outline-none focus:underline"
                aria-label="Go to login page"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>

      <header className="flex flex-col w-[1144px] h-[69px] items-start pt-4 pb-[0.8px] px-4 absolute top-0 left-0 bg-white border-b-[0.8px] [border-bottom-style:solid] border-[#0000001a]">
        <nav
          className="flex h-9 items-center justify-between pr-[-4.58e-05px] pl-0 py-0 relative self-stretch w-full"
          aria-label="Main navigation"
        >
          <div className="flex w-[208.88px] h-7 items-center gap-8 relative">
            <a
              href="/"
              className="flex w-[126.04px] h-7 items-center gap-2 relative focus:outline-none focus:ring-2 focus:ring-[#155cfb] rounded"
              aria-label="Podstream home"
            >
              <img
                className="relative w-6 h-6"
                alt=""
                src="https://c.animaapp.com/xbrI9XMG/img/icon.svg"
                aria-hidden="true"
              />

              <div className="relative flex-1 grow h-7">
                <span className="absolute -top-0.5 left-0 [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-xl tracking-[0] leading-7 whitespace-nowrap">
                  Podstream
                </span>
              </div>
            </a>

            <button
              type="button"
              onClick={handleBrowseClick}
              className="relative w-[50.84px] h-6 focus:outline-none focus:ring-2 focus:ring-[#155cfb] rounded cursor-pointer hover:text-neutral-950 transition-colors"
              aria-label="Browse podcasts"
            >
              <span className="absolute -top-0.5 left-0 [font-family:'Arimo',Helvetica] font-normal text-[#354152] text-base tracking-[0] leading-6 whitespace-nowrap">
                Browse
              </span>
            </button>
          </div>

          <div className="flex w-[167.09px] h-9 items-center gap-4 relative">
            <button
              type="button"
              onClick={handleLoginClick}
              className="all-[unset] box-border flex flex-col w-[69.08px] h-9 items-start relative cursor-pointer"
              aria-label="Login to your account"
            >
              <span className="all-[unset] box-border relative self-stretch w-full bg-white border-[0.8px] border-solid border-[#0000001a] h-9 rounded-lg hover:bg-[#f3f3f5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#155cfb] flex items-center justify-center">
                <span className="text-neutral-950 [font-family:'Arimo',Helvetica] font-normal text-sm tracking-[0] leading-5 whitespace-nowrap">
                  Login
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleSignUpNavClick}
              className="all-[unset] box-border flex flex-col w-[82.01px] h-9 items-start relative cursor-pointer"
              aria-label="Sign up for an account"
            >
              <span className="all-[unset] box-border relative self-stretch w-full bg-[#030213] h-9 rounded-lg hover:bg-[#0a0a1f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#155cfb] flex items-center justify-center">
                <span className="[font-family:'Arimo',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                  Sign Up
                </span>
              </span>
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};