import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  return (
    <header className="flex flex-col w-full h-[73px] items-center pt-4 pb-[0.8px] px-4 fixed top-0 left-0 bg-white border-b-[0.8px] [border-bottom-style:solid] border-[#0000001a] z-10">
      <nav
        className="h-10 justify-between pr-[7.63e-05px] pl-0 py-0 self-stretch w-full max-w-6xl mx-auto flex items-center relative"
        aria-label="Main navigation"
      >
        {/* --- Logo & Browse --- */}
        <div className="flex w-[208.88px] h-7 items-center gap-8 relative">
          <button
            onClick={() => navigate("/")}
            className="flex w-[126.04px] h-7 items-center gap-2 relative"
          >
            <img
              className="relative w-6 h-6"
              alt="Icon"
              src="https://c.animaapp.com/mhs1rzskhGRsS4/img/icon.svg"
            />
            <div className="relative flex-1 grow h-7">
              <h1 className="absolute -top-0.5 left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-xl tracking-[0] leading-7 whitespace-nowrap">
                Podstream
              </h1>
            </div>
          </button>
          <button
            onClick={() => navigate("/browse")}
            className="relative w-[50.84px] h-6"
          >
            <span className="absolute -top-0.5 left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#354152] text-base tracking-[0] leading-6 whitespace-nowrap">
              Browse
            </span>
          </button>
        </div>

        {/* --- Auth Buttons (Dynamic) --- */}
        <div className="flex items-center gap-4 relative">
          {user ? (
            <>
              <button
                className="all-[unset] box-border relative h-9 px-4 rounded-lg cursor-pointer"
                type="button"
                aria-label="Go to My Library"
                // onClick={() => navigate("/library")}
              >
                <span className="[font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowTwrap">
                  My Library
                </span>
              </button>
              <button
                className="flex-col w-10 h-10 items-start flex relative cursor-pointer"
                type="button"
                aria-label="User profile"
                onClick={() => navigate("/profile")}
              >
                <div className="flex h-10 items-start relative self-stretch w-full rounded-full overflow-hidden">
                  <div className="flex h-10 items-center justify-center relative flex-1 grow bg-[#ececf0] rounded-full">
                    <span className="relative w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-6 whitespace-nowrap">
                      {user.initial || "P"}
                    </span>
                  </div>
                </div>
              </button>
              <button
                onClick={logout}
                className="all-[unset] box-border relative h-9 px-4 rounded-lg cursor-pointer text-sm text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="all-[unset] box-border flex flex-col w-[69.08px] h-9 items-start relative"
              >
                <span className="all-[unset] box-border relative self-stretch w-full bg-white border-[0.8px] border-solid border-[#0000001a] h-9 rounded-lg flex items-center justify-center">
                  <span className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowrap">
                    Login
                  </span>
                </span>
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="all-[unset] box-border flex flex-col w-[82.01px] h-9 items-start relative"
              >
                <span className="all-[unset] box-border relative self-stretch w-full bg-[#030213] h-9 rounded-lg flex items-center justify-center">
                  <span className="[font-family:'Arimo',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                    Sign Up
                  </span>
                </span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};