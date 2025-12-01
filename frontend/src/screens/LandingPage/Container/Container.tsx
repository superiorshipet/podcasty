import React from "react";
import { useNavigate } from "react-router-dom";

// (Hero Section) - Refactored for Responsiveness & Polish
export const Container = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full items-center pt-20 pb-12 px-4 bg-[linear-gradient(135deg,rgba(249,250,251,1)_0%,rgba(243,244,246,1)_100%)]">
      <div className="relative w-full max-w-6xl mx-auto h-[140px] text-center">
        <p className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base sm:text-lg md:text-xl tracking-[0] leading-7">
          Find your new favorite podcast
        </p>
        
        <p className="mt-4 [font-family:'Arimo',Helvetica] font-normal text-[#495565] text-lg sm:text-xl md:text-2xl tracking-[0] leading-7 max-w-2xl mx-auto">
          Discover thousands of podcasts across every topic imaginable
        </p>

        <button 
          onClick={() => navigate("/browse")}
          className="all-[unset] box-border mt-6 w-40 h-10 flex items-center justify-center bg-[#030213] text-white rounded-lg cursor-pointer mx-auto
                     [font-family:'Arimo',Helvetica] font-normal text-sm tracking-[0] leading-5
                     transition-all duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213]" // <-- إضافة Hover & Focus
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
};