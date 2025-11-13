import React, { useState } from "react";
// Removed the broken 'import vector from "./vector.svg"'

export const Profile = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<
    "listening" | "following" | "favorites"
  >("listening");
  const tabs = [
    { id: "listening" as const, label: "Listening History" },
    { id: "following" as const, label: "Following" },
    { id: "favorites" as const, label: "Favorites" },
  ];
  const userId = "2201547";
  const userInitial = "2";
  return (
    <div className="bg-white overflow-x-hidden w-full min-w-[1159px] min-h-[690px] relative">
      <header className="flex flex-col w-[1159px] h-[73px] items-start pt-4 pb-[0.8px] px-4 absolute top-0 left-0 bg-white border-b-[0.8px] [border-bottom-style:solid] border-[#0000001a]">
        <nav
          className="h-10 justify-between pr-[7.63e-05px] pl-0 py-0 self-stretch w-full flex items-center relative"
          aria-label="Main navigation"
        >
          <div className="w-[208.88px] h-7 gap-8 flex items-center relative">
            <div className="flex w-[126.04px] h-7 items-center gap-2 relative">
              <div className="relative w-6 h-6" aria-hidden="true">
                {/* Replaced broken vector.svg with the working CDN icon */}
                <img
                  className="absolute w-[75.00%] h-[75.00%] top-[8.33%] left-[8.33%]"
                  alt="Icon"
                  src="https://c.animaapp.com/mhs1rzskhGRsS4/img/icon.svg"
                />
              </div>
              <div className="relative flex-1 grow h-7">
                <h1 className="absolute -top-0.5 left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-xl tracking-[0] leading-7 whitespace-nowrap">
                  Podstream
                </h1>
              </div>
            </div>
            <a href="/browse" className="relative w-[50.84px] h-6">
              <span className="absolute -top-0.5 left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#354152] text-base tracking-[0] leading-6 whitespace-nowrap">
                Browse
              </span>
            </a>
          </div>
          <div className="w-[156.2px] h-10 gap-4 flex items-center relative">
            <div className="flex flex-col w-[100.2px] h-9 items-start relative">
              <button
                className="all-[unset] box-border relative self-stretch w-full h-9 rounded-lg cursor-pointer"
                type="button"
                aria-label="Go to My Library"
              >
                <span className="absolute top-[7px] left-4 [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowrap">
                  My Library
                </span>
              </button>
            </div>
            <button
              className="flex-col w-10 h-10 items-start flex relative cursor-pointer"
              type="button"
              aria-label="User profile"
            >
              <div className="flex h-10 items-start relative self-stretch w-full rounded-[26843500px] overflow-hidden">
                <div className="flex h-10 items-center justify-center relative flex-1 grow bg-[#ececf0] rounded-[26843500px]">
                  <span className="relative w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-6 whitespace-nowrap">
                    {userInitial}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </nav>
      </header>
      <main className="flex flex-col w-[1159px] h-[690px] items-start gap-8 pt-[104.8px] pb-0 px-4 absolute top-0 left-0 bg-white">
        <section className="relative self-stretch w-full h-[128.8px] border-b-[0.8px] [border-bottom-style:solid] border-[#0000001a]">
          <div className="absolute top-8 left-[120px] w-[882px] h-6 flex">
            <p className="mt-[-2.2px] w-[63px] h-6 [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-6 whitespace-nowrap">
              {userId}
            </p>
          </div>
          <button
            className="all-[unset] box-border flex w-[101px] h-9 items-center justify-center gap-2 px-4 py-2 absolute top-[30px] left-[1026px] bg-[#030213] rounded-lg cursor-pointer"
            type="button"
            aria-label="Edit your profile"
          >
            <span className="relative w-fit mt-[-1.00px] [font-family:'Arimo-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
              Edit Profile
            </span>
          </button>
          <div
            className="flex w-24 h-24 items-start absolute top-0 left-0 rounded-[26843500px] overflow-hidden"
            aria-hidden="true"
          >
            <div className="flex h-24 items-center justify-center relative flex-1 grow bg-[#ececf0] rounded-[26843500px]">
              <span className="relative w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-2xl tracking-[0] leading-8 whitespace-nowrap">
                {userInitial}
              </span>
            </div>
          </div>
        </section>
        <section className="flex flex-col h-[68px] items-start gap-2 relative self-stretch w-full">
          <div
            className="flex w-[284.68px] items-center justify-center gap-[7.63e-06px] pr-[1.53e-05px] pl-0 py-0 relative flex-1 grow bg-[#ececf0] rounded-[14px]"
            role="tablist"
            aria-label="Profile sections"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`h-[29px] items-center justify-center gap-1.5 px-2 py-1 flex-1 grow rounded-[14px] border-[0.8px] border-solid border-transparent flex relative cursor-pointer ${
                  activeTab === tab.id ? "bg-white" : ""
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span
                  className={`relative w-fit mt-[-0.30px] [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowrap ${
                    activeTab === tab.id && tab.id === "listening"
                      ? "ml-[-12.55px] mr-[-12.55px]"
                      : ""
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
          <div
            className="relative w-[1127.2px] h-6"
            role="tabpanel"
            id={`${activeTab}-panel`}
            aria-labelledby={`${activeTab}-tab`}
          >
            <p className="absolute -top-0.5 left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#495565] text-base tracking-[0] leading-6 whitespace-nowrap">
              {activeTab === "listening" && "No listening history yet"}
              {activeTab === "following" && "No following yet"}
              {activeTab === "favorites" && "No favorites yet"}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};