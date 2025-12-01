import React from "react";
import { useNavigate } from "react-router-dom";

export const Footer = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <footer className="flex flex-col w-full items-center pt-12 pb-8 px-4 bg-white border-t-[0.8px] [border-top-style:solid] border-[#0000001a]">
      <div className="flex flex-col h-auto items-center gap-4 relative w-full max-w-6xl">
        <div className="flex h-6 items-start justify-center gap-8 relative self-stretch w-full">
          <button
            onClick={() => navigate("/about")} 
            className="[font-family:'Arimo',Helvetica] font-normal text-[#495565] text-base"
          >
            About
          </button>
          <button
            onClick={() => navigate("/contact")} 
            className="[font-family:'Arimo',Helvetica] font-normal text-[#495565] text-base"
          >
            Contact
          </button>
          <button
            onClick={() => navigate("/terms")} 
            className="[font-family:'Arimo',Helvetica] font-normal text-[#495565] text-base"
          >
            Terms of Service
          </button>
        </div>
        <div className="relative self-stretch w-full h-5">
          <p className="[font-family:'Arimo',Helvetica] font-normal text-[#697282] text-sm text-center">
            © 2025 Podcasty. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};