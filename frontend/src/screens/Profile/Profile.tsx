import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; 

// (1) Translated Tabs to English
type TabData = { id: string; title: string; content: string };
const tabsData: TabData[] = [
  { id: "listening", title: "Listening History", content: "No listening history yet." },
  { id: "following", title: "Following", content: "You are not following any podcasts yet." },
  { id: "favorites", title: "Favorites", content: "You have no favorite episodes yet." },
];

export const Profile = (): JSX.Element => {
  const navigate = useNavigate(); 
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState<string>(tabsData[0].id);
  
  // (2) Removed the hasPodcasts logic, it's no longer needed here.
  
  // (3) Simplified click handler
  const handleMyPodcastsClick = () => {
    navigate("/creator/dashboard");
  };

  if (!user) {
    return (
      <main className="w-full max-w-6xl mx-auto pt-8 px-4 [font-family:'Arimo',Helvetica]">
        Loading profile...
      </main>
    );
  }

  return (
    <div className="bg-white overflow-x-hidden w-full min-h-screen relative">
      
      <main className="flex flex-col w-full max-w-6xl mx-auto items-start gap-8 pt-8 pb-12 px-4">
        
        {/* --- User Info Section --- */}
        <section className="relative self-stretch w-full h-auto pb-8 border-b-[0.8px] [border-bottom-style:solid] border-[#0000001a] flex flex-col md:flex-row items-center">
          
          <div
            className="flex w-24 h-24 items-center justify-center flex-shrink-0 bg-[#ececf0] rounded-full overflow-hidden"
            aria-hidden="true"
          >
            {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <span className="[font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-2xl tracking-[0] leading-8">
                  {user.initial}
                </span>
            )}
          </div>
          
          <div className="flex flex-col items-center md:items-start md:ml-6 mt-4 md:mt-0">
            <h2 className="[font-family:'Arimo-Regular',Helvetica] font-bold text-neutral-950 text-2xl tracking-[0] leading-6">
              {user.username}
            </h2>
            <p className="mt-2 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#495565] text-base tracking-[0] leading-6">
              {user.bio || "No bio available."}
            </p>
          </div>
          
          {/* --- (4) Button Group (Translated) --- */}
          <div className="flex items-center gap-4 md:ml-auto mt-4 md:mt-0">
            <button
              onClick={handleMyPodcastsClick} // Simplified logic
              className="all-[unset] box-border flex w-auto h-9 items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg cursor-pointer text-sm [font-family:'Arimo-Regular',Helvetica] transition-colors hover:bg-gray-50"
              type="button"
              aria-label="My Podcasts"
            >
              <span>My Podcasts</span>
            </button>
            
            <button
              onClick={() => navigate("/edit-profile")} 
              className="all-[unset] box-border flex w-auto h-9 items-center justify-center gap-2 px-4 py-2 bg-[#030213] rounded-lg cursor-pointer text-white text-sm [font-family:'Arimo-Regular',Helvetica] transition-opacity hover:bg-opacity-90"
              type="button"
              aria-label="Edit your profile"
            >
              <span>Edit Profile</span>
            </button>
          </div>
        </section>

        {/* --- (5) Tabs Section (Translated) --- */}
        <section className="flex flex-col items-start gap-4 relative self-stretch w-full">
          <div
            className="flex w-auto items-center justify-start gap-2 p-1 bg-[#ececf0] rounded-lg"
            role="tablist"
            aria-label="Profile sections"
          >
            {tabsData.map((tab) => (
              <button
                key={tab.id}
                className={`all-[unset] box-border h-auto items-center justify-center gap-1.5 px-4 py-1.5 flex relative cursor-pointer rounded-md
                  ${activeTab === tab.id ? "bg-white shadow-sm" : ""}
                  transition-all duration-200 ease-in-out
                `}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span
                  className={`relative w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowrap`}
                >
                  {tab.title} {/* Now in English */}
                </span>
              </button>
            ))}
          </div>

          <div
            className="relative w-full min-h-[100px] pt-2"
            role="tabpanel"
          >
            {tabsData.map((tab) => (
              <div key={tab.id} className={`${activeTab === tab.id ? "block" : "hidden"}`}>
                <p className="[font-family:'Arimo-Regular',Helvetica] font-normal text-[#495565] text-base tracking-[0] leading-6 whitespace-nowrap">
                  {tab.content} {/* Now in English */}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};