import React from "react";

export const Navbar = (): JSX.Element => {
  return (
    <div className="flex flex-col w-[1144px] h-[69px] items-start pt-4 pb-[0.8px] px-4 absolute top-0 left-[-7px] bg-white border-b-[0.8px] [border-bottom-style:solid] border-[#0000001a]">
      <div className="flex h-9 items-center justify-between pr-[-4.58e-05px] pl-0 py-0 relative self-stretch w-full">
        <div className="flex w-[208.88px] h-7 items-center gap-8 relative">
          <div className="flex w-[126.04px] h-7 items-center gap-2 relative">
            <img
              className="relative w-6 h-6"
              alt="Icon"
              src="https://c.animaapp.com/mhs1rzskhGRsS4/img/icon.svg"
            />

            <div className="relative flex-1 grow h-7">
              <div className="absolute -top-0.5 left-0 [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-xl tracking-[0] leading-7 whitespace-nowrap">
                Podstream
              </div>
            </div>
          </div>

          <div className="relative w-[50.84px] h-6">
            <div className="absolute -top-0.5 left-0 [font-family:'Arimo',Helvetica] font-normal text-[#354152] text-base tracking-[0] leading-6 whitespace-nowrap">
              Browse
            </div>
          </div>
        </div>

        <div className="flex w-[167.09px] h-9 items-center gap-4 relative">
          <button className="all-[unset] box-border flex flex-col w-[69.08px] h-9 items-start relative">
            <button className="all-[unset] box-border self-stretch w-full bg-white border-[0.8px] border-solid border-[#0000001a] h-9 relative rounded-lg">
              <div className="absolute top-[7px] left-[17px] [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowrap">
                Login
              </div>
            </button>
          </button>

          <button className="all-[unset] box-border flex flex-col w-[82.01px] h-9 items-start relative">
            <button className="all-[unset] box-border self-stretch w-full bg-[#030213] h-9 relative rounded-lg">
              <div className="absolute top-[7px] left-4 [font-family:'Arimo',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                Sign Up
              </div>
            </button>
          </button>
        </div>
      </div>
    </div>
  );
};
