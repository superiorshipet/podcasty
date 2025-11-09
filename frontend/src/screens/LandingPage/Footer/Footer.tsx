import React from "react";

export const Footer = (): JSX.Element => {
  return (
    <footer className="flex flex-col w-[1144px] h-[157px] items-start pt-[48.8px] pb-0 px-0 absolute top-[1231px] left-0 bg-transparent border-t-[0.8px] [border-top-style:solid] [border-right-style:none] [border-bottom-style:none] [border-left-style:none] border-[#0000001a]">
      <div className="flex flex-col h-[60px] items-start gap-4 px-4 py-0 relative self-stretch w-full">
        <div className="flex h-6 items-start justify-center gap-8 pr-[7.63e-06px] pl-0 py-0 relative self-stretch w-full">
          <div className="relative w-[43.59px] h-6">
            <div className="absolute -top-0.5 left-0 [font-family:'Arimo',Helvetica] font-normal text-[#495565] text-base tracking-[0] leading-6 whitespace-nowrap">
              About
            </div>
          </div>

          <div className="relative w-[54.71px] h-6">
            <div className="absolute -top-0.5 left-0 [font-family:'Arimo',Helvetica] font-normal text-[#495565] text-base tracking-[0] leading-6 whitespace-nowrap">
              Contact
            </div>
          </div>

          <div className="relative w-[114.2px] h-6">
            <div className="absolute -top-0.5 left-0 [font-family:'Arimo',Helvetica] font-normal text-[#495565] text-base tracking-[0] leading-6 whitespace-nowrap">
              Terms of Service
            </div>
          </div>
        </div>

        <div className="relative self-stretch w-full h-5">
          <p className="absolute -top-px left-[436px] [font-family:'Arimo',Helvetica] font-normal text-[#697282] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
            © 2025 Podstream. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
