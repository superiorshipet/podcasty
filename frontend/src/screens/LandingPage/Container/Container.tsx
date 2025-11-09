import React from "react";

export const Container = (): JSX.Element => {
  return (
    <div className="flex flex-col w-[1144px] h-[300px] items-start pt-20 pb-0 px-0 absolute top-[69px] left-0 bg-[linear-gradient(135deg,rgba(249,250,251,1)_0%,rgba(243,244,246,1)_100%)]">
      <div className="relative self-stretch w-full h-[140px]">
        <div className="absolute top-0 left-4 w-[1112px] h-6 flex">
          <p className="mt-[-2.2px] w-[219px] h-6 ml-[447.1px] [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base text-center tracking-[0] leading-6 whitespace-nowrap">
            Find your new favorite podcast
          </p>
        </div>

        <div className="absolute top-10 left-[236px] w-[672px] h-7 flex">
          <p className="mt-[-2.2px] w-[553px] h-7 ml-[60.3px] [font-family:'Arimo',Helvetica] font-normal text-[#495565] text-xl text-center tracking-[0] leading-7 whitespace-nowrap">
            Discover thousands of podcasts across every topic imaginable
          </p>
        </div>

        <button className="all-[unset] box-border absolute top-[100px] left-[501px] w-[142px] h-10 flex bg-[#030213] rounded-lg">
          <div className="mt-[8.8px] w-[92px] h-5 ml-6 [font-family:'Arimo',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
            Start Exploring
          </div>
        </button>
      </div>
    </div>
  );
};
