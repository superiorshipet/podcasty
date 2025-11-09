import React from "react";

export const Login = () => {
  return (
    <div
      className="bg-white w-full min-w-[1144px] min-h-[717px] relative"
      data-model-id="1:141"
    >
      <div className="flex flex-col w-[1144px] h-[717px] items-start gap-6 pl-[348px] pr-0 pt-[129.15px] pb-0 absolute top-0 left-0 bg-white rounded-[14px] border-[0.8px] border-solid border-[#0000001a]">
        <div className="relative w-[446.4px] h-[70px]">
          <div className="absolute top-6 left-6 w-[398px] h-4 flex">
            <div className="mt-[-2.2px] w-10 h-4 [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-4 whitespace-nowrap">
              Login
            </div>
          </div>

          <div className="absolute top-[46px] left-6 w-[398px] h-6 flex">
            <p className="mt-[-2.2px] w-[324px] h-6 [font-family:'Arimo',Helvetica] font-normal text-[#717182] text-base tracking-[0] leading-6 whitespace-nowrap">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        <div className="flex flex-col w-[446.4px] h-[336px] items-start gap-4 px-6 py-0 relative">
          <div className="flex flex-col h-[168px] items-start gap-4 relative self-stretch w-full">
            <div className="flex-col h-[50px] items-start self-stretch w-full flex relative">
              <div className="flex h-3.5 items-center gap-2 relative self-stretch w-full">
                <label
                  className="relative w-fit mt-[-1.00px] [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-[14px] whitespace-nowrap"
                  htmlFor="input-1"
                >
                  Email
                </label>
              </div>

              <input
                className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg overflow-hidden border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-[#717182] text-sm tracking-[0] leading-[normal] whitespace-nowrap"
                id="input-1"
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <div className="flex-col h-[50px] items-start self-stretch w-full flex relative">
              <div className="flex h-3.5 items-center gap-2 relative self-stretch w-full">
                <label
                  className="relative w-fit mt-[-1.00px] [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-[14px] whitespace-nowrap"
                  htmlFor="input-2"
                >
                  Password
                </label>
              </div>

              <input
                className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg overflow-hidden border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-[#717182] text-sm tracking-[0] leading-[normal] whitespace-nowrap"
                id="input-2"
                placeholder="••••••••"
                type="text"
              />
            </div>

            <button className="all-[unset] box-border bg-[#030213] relative self-stretch w-full h-9 rounded-lg">
              <div className="absolute top-[7px] left-[181px] [font-family:'Arimo',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                Login
              </div>
            </button>
          </div>

          <div className="h-5 relative self-stretch w-full">
            <div className="absolute -top-px left-[101px] w-[149px] [font-family:'Arimo',Helvetica] font-normal text-[#495565] text-sm text-center tracking-[0] leading-5">
              Don&#39;t have an account?
            </div>

            <div className="flex w-[47px] h-[18px] items-start absolute top-px left-[250px]">
              <div className="relative w-fit mt-[-1.00px] mb-[-0.60px] mr-[-1.01px] [font-family:'Arimo',Helvetica] font-normal text-[#155cfb] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
                Sign up
              </div>
            </div>
          </div>

          <div className="flex flex-col h-[92px] items-start gap-2 pt-3 pb-0 px-3 bg-gray-50 rounded relative self-stretch w-full">
            <div className="relative self-stretch w-full h-5">
              <div className="absolute -top-px left-0 [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowrap">
                Demo accounts:
              </div>
            </div>

            <div className="relative self-stretch w-full h-5">
              <div className="absolute -top-px left-0 [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowrap">
                Creator: john@example.com
              </div>
            </div>

            <div className="relative self-stretch w-full h-5">
              <div className="absolute -top-px left-0 [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowrap">
                Admin: admin@podstream.com
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-[1144px] h-[69px] items-start pt-4 pb-[0.8px] px-4 absolute top-[26px] left-0 bg-white border-b-[0.8px] [border-bottom-style:solid] border-[#0000001a]">
        <div className="h-9 items-center justify-between pr-[-4.58e-05px] pl-0 py-0 self-stretch w-full flex relative">
          <div className="w-[208.88px] h-7 items-center gap-8 flex relative">
            <div className="flex w-[126.04px] h-7 items-center gap-2 relative">
              <img
                className="relative w-6 h-6"
                alt="Icon"
                src="https://c.animaapp.com/mhs3ogj61sWYpx/img/icon.svg"
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

          <div className="w-[167.09px] h-9 items-center gap-4 flex relative">
            <button className="all-[unset] box-border flex flex-col w-[69.08px] h-9 items-start relative">
              <button className="all-[unset] box-border bg-white border-[0.8px] border-solid border-[#0000001a] relative self-stretch w-full h-9 rounded-lg">
                <div className="absolute top-[7px] left-[17px] [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowrap">
                  Login
                </div>
              </button>
            </button>

            <button className="all-[unset] box-border flex flex-col w-[82.01px] h-9 items-start relative">
              <button className="all-[unset] box-border bg-[#030213] relative self-stretch w-full h-9 rounded-lg">
                <div className="absolute top-[7px] left-4 [font-family:'Arimo',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                  Sign Up
                </div>
              </button>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
