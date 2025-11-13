import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock data for the episodes based on your screenshot
const episodes = [
  {
    id: 1,
    title: "The Future of AI",
    duration: "30:45",
  },
  {
    id: 2,
    title: "Blockchain Explained",
    duration: "35:00",
  },
  {
    id: 3,
    title: "Quantum Computing Basics",
    duration: "32:00",
  },
];

// Mock data for the main podcast
const podcastInfo = {
  title: "Tech Talks Daily",
  author: "johndoe",
  description: "Your daily dose of technology news and insights from industry leaders.",
  imageUrl: "https://placehold.co/288x288/222222/ffffff?text=Tech+Talks",
};

// --- SVG Icons (for a cleaner component) ---
const PlayIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.3 4.31A1.2 1.2 0 0 0 4.5 5.5v9a1.2 1.2 0 0 0 1.8 1.09l7.2-4.5a1.2 1.2 0 0 0 0-2.18l-7.2-4.5Z" />
  </svg>
);
const PauseIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 4.5A1.5 1.5 0 0 0 4 6v8a1.5 1.5 0 0 0 1.5 1.5h1A1.5 1.5 0 0 0 8 14V6a1.5 1.5 0 0 0-1.5-1.5h-1ZM12.5 4.5A1.5 1.5 0 0 0 11 6v8a1.5 1.5 0 0 0 1.5 1.5h1A1.5 1.5 0 0 0 16 14V6a1.5 1.5 0 0 0-1.5-1.5h-1Z" />
  </svg>
);
const PrevIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 4.31A1.2 1.2 0 0 0 10.7 5.4l-4.5 3.6a1.2 1.2 0 0 0 0 1.8l4.5 3.6a1.2 1.2 0 0 0 1.8-1.09V5.5a1.2 1.2 0 0 0-.59-1.09Z" />
    <path d="M6 4.5a1.5 1.5 0 0 0-1.5 1.5v8A1.5 1.5 0 0 0 6 15.5h.5a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 6.5 4.5H6Z" />
  </svg>
);
const NextIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 4.31A1.2 1.2 0 0 1 9.3 5.4l4.5 3.6a1.2 1.2 0 0 1 0 1.8l-4.5 3.6A1.2 1.2 0 0 1 7.5 13.4V5.5a1.2 1.2 0 0 1 .59-1.09Z" />
    <path d="M14 4.5a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-.5a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 13.5 4.5H14Z" />
  </svg>
);
const FollowIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.5h1.5a.75.75 0 0 0 .75-.75V8.25a.75.75 0 0 0-.75-.75H3a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 .75.75Z" />
  </svg>
);
const FavoriteIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.31h5.408c.49 0 .732.657.36.986l-4.418 3.203a.563.563 0 0 0-.202.634l1.618 4.83c.14.418-.362.79-.732.559l-4.418-3.203a.563.563 0 0 0-.676 0l-4.418 3.203c-.37.231-.872-.14-.732-.56l1.618-4.83a.563.563 0 0 0-.202-.634L2.384 9.91a.563.563 0 0 1 .36-.986h5.408a.563.563 0 0 0 .475-.31l2.125-5.112Z" />
  </svg>
);
const LikeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9 9 0 0 1 1.423-1.423.48.48 0 0 1 .642 0 9 9 0 0 1 1.423 1.423c.498.634 1.225 1.08 2.031 1.08h.348a.48.48 0 0 1 .42.646 9 9 0 0 1-2.098 5.43.48.48 0 0 1-.58.142 9 9 0 0 1-5.46-2.098.48.48 0 0 1-.142-.58 9 9 0 0 1 5.43-2.098.48.48 0 0 1 .646.42Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25 2.25 6.615 2.25 12s4.365 9.75 9.75 9.75Z" />
  </svg>
);
// --- End SVG Icons ---

export const Podcast = (): JSX.Element => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"episodes" | "comments">(
    "episodes"
  );
  const [currentEpisode, setCurrentEpisode] = useState(episodes[0]);
  const userInitial = "2";

  return (
    // Add pb-24 to the wrapper to avoid player overlap
    <div className="bg-white overflow-x-hidden w-full min-w-[1159px] min-h-screen relative pb-24">
      {/* --- Header (Copied from Profile) --- */}
      <header className="flex flex-col w-[1159px] h-[73px] items-start pt-4 pb-[0.8px] px-4 absolute top-0 left-0 bg-white border-b-[0.8px] [border-bottom-style:solid] border-[#0000001a] z-10">
        <nav
          className="h-10 justify-between pr-[7.63e-05px] pl-0 py-0 self-stretch w-full flex items-center relative"
          aria-label="Main navigation"
        >
          <div className="w-[208.88px] h-7 gap-8 flex items-center relative">
            <div className="flex w-[126.04px] h-7 items-center gap-2 relative">
              <div className="relative w-6 h-6" aria-hidden="true">
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
            {/* Updated to use navigate */}
            <button
              onClick={() => navigate("/browse")}
              className="relative w-[50.84px] h-6"
            >
              <span className="absolute -top-0.5 left-0 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#354152] text-base tracking-[0] leading-6 whitespace-nowrap">
                Browse
              </span>
            </button>
          </div>
          <div className="w-[156.2px] h-10 gap-4 flex items-center relative">
            <div className="flex flex-col w-[100.2px] h-9 items-start relative">
              <button
                className="all-[unset] box-border relative self-stretch w-full h-9 rounded-lg cursor-pointer"
                type="button"
                aria-label="Go to My Library"
                // onClick={() => navigate("/library")} // You can add this route
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
              onClick={() => navigate("/profile")}
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

      {/* --- Main Content (2-Column) --- */}
      <main className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto items-start gap-8 pt-[104.8px] pb-0 px-4">
        {/* --- Left Column (Info) --- */}
        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col items-center lg:items-start gap-4">
          <img
            className="w-full h-auto lg:w-72 lg:h-72 object-cover rounded-lg shadow-lg"
            src={podcastInfo.imageUrl}
            alt="Podcast Cover"
          />
          <h2 className="text-2xl font-bold text-neutral-950">
            {podcastInfo.title}
          </h2>
          <p className="text-base text-gray-600">by {podcastInfo.author}</p>

          <button className="all-[unset] box-border w-full h-10 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg cursor-pointer">
            <FollowIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Follow</span>
          </button>
          <button className="all-[unset] box-border w-full h-10 flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg cursor-pointer">
            <FavoriteIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Favorite</span>
          </button>
          <button className="all-[unset] box-border w-full h-10 flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg cursor-pointer">
            <LikeIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Like</span>
          </button>

          <p className="text-sm text-gray-500 mt-4">
            {podcastInfo.description}
          </p>
        </div>

        {/* --- Right Column (Episodes) --- */}
        <div className="flex-1 w-full">
          {/* --- Tabs --- */}
          <div className="flex items-start gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("episodes")}
              className={`py-2 px-1 border-b-2 ${
                activeTab === "episodes"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500"
              } [font-family:'Arimo-Regular',Helvetica] font-normal text-base`}
            >
              Episodes
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`py-2 px-1 border-b-2 ${
                activeTab === "comments"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500"
              } [font-family:'Arimo-Regular',Helvetica] font-normal text-base`}
            >
              Comments
            </button>
          </div>

          {/* --- Content based on tab --- */}
          <div className="mt-6">
            {activeTab === "episodes" && (
              <div className="flex flex-col gap-4">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg"
                  >
                    <button
                      onClick={() => setCurrentEpisode(episode)}
                      className="all-[unset] box-border w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 mr-4 cursor-pointer"
                    >
                      <PlayIcon className="w-5 h-5 text-gray-900" />
                    </button>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-900 [font-family:'Arimo-Regular',Helvetica]">
                        {episode.title}
                      </h3>
                      <span className="text-sm text-gray-500 [font-family:'Arimo-Regular',Helvetica]">
                        {episode.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "comments" && (
              <p className="text-gray-500 [font-family:'Arimo-Regular',Helvetica]">
                No comments yet.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* --- Footer Player --- */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex items-center px-4 z-20">
        <div className="flex items-center gap-3 w-1/4">
          <img
            src="https://placehold.co/48x48/222222/ffffff?text=Ep"
            alt="Current Episode"
            className="w-12 h-12 rounded"
          />
          <div>
            <h4 className="text-sm font-medium text-gray-900 [font-family:'Arimo-Regular',Helvetica]">
              {currentEpisode.title}
            </h4>
            <p className="text-xs text-gray-500 [font-family:'Arimo-Regular',Helvetica]">
              {podcastInfo.author}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-2 w-1/2">
          {/* Player Controls */}
          <div className="flex items-center gap-4">
            <button className="all-[unset] box-border text-gray-700">
              <PrevIcon className="w-6 h-6" />
            </button>
            <button className="all-[unset] box-border w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white">
              <PauseIcon className="w-6 h-6" />
            </button>
            <button className="all-[unset] box-border text-gray-700">
              <NextIcon className="w-6 h-6" />
            </button>
          </div>
          {/* Timeline */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-500 [font-family:'Arimo-Regular',Helvetica]">0:00</span>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="0"
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 [font-family:'Arimo-Regular',Helvetica]">
              {currentEpisode.duration}
            </span>
          </div>
        </div>
        
        <div className="w-1/4">
          {/* Volume controls etc. can go here */}
        </div>
      </footer>
    </div>
  );
};