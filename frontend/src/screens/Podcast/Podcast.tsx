import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePlayer } from "../../contexts/PlayerContext";
import { useAuth } from "../../contexts/AuthContext"; // <-- (1) استدعاء Auth
import { Podcast as PodcastType, Episode } from "../../types";

// --- SVG Icons (للتوضيح) ---
const PlayIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.3 4.31A1.2 1.2 0 0 0 4.5 5.5v9a1.2 1.2 0 0 0 1.8 1.09l7.2-4.5a1.2 1.2 0 0 0 0-2.18l-7.2-4.5Z" />
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
  const { podcastId } = useParams<{ podcastId: string }>();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  const { user, openLoginModal } = useAuth(); // <-- (2) استدعاء الـ Modal

  const [podcastInfo, setPodcastInfo] = useState<PodcastType | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"episodes" | "comments">(
    "episodes"
  );

  useEffect(() => {
    const fetchPodcastData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- [هنا ستضع كود جلب الـ API] ---
        // const podcastRes = await fetch(`/api/podcasts/${podcastId}`);
        // const episodesRes = await fetch(`/api/podcasts/${podcastId}/episodes`);
        // const podcastData = await podcastRes.json();
        // const episodesData = await episodesRes.json();
        // setPodcastInfo(podcastData);
        // setEpisodes(episodesData);
        // ------------------------------------

        // --- بيانات وهمية مؤقتة ---
        await new Promise(res => setTimeout(res, 1000));
        setPodcastInfo({
          id: podcastId || "1",
          title: "Tech Talks Daily",
          author: "johndoe",
          description: "Your daily dose of technology news and insights from industry leaders.",
          imageUrl: "https://placehold.co/288x288/222222/ffffff?text=Tech+Talks",
        });
        setEpisodes([
          { id: "e1", title: "The Future of AI", duration: "30:45", audioUrl: "URL_TO_AUDIO_1" },
          { id: "e2", title: "Blockchain Explained", duration: "35:00", audioUrl: "URL_TO_AUDIO_2" },
          { id: "e3", title: "Quantum Computing Basics", duration: "32:00", audioUrl: "URL_TO_AUDIO_3" },
        ]);
      } catch (err) {
        setError("Failed to load podcast details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPodcastData();
  }, [podcastId]);

  // --- (3) دوال الـ "Guest Mode" ---
  const handlePlay = (episode: Episode) => {
    if (!user) {
      openLoginModal();
    } else {
      playTrack(episode, podcastInfo!);
    }
  };

  const handleFollow = () => {
    if (!user) {
      openLoginModal();
    } else {
      // (TODO: API call to follow)
      console.log("API: Follow podcast");
    }
  };

  const handleFavorite = () => {
    if (!user) {
      openLoginModal();
    } else {
      // (TODO: API call to favorite)
      console.log("API: Favorite podcast");
    }
  };

  const handleLike = () => {
    if (!user) {
      openLoginModal();
    } else {
      // (TODO: API call to like)
      console.log("API: Like podcast");
    }
  };


  if (isLoading) {
    return <div className="w-full text-center [font-family:'Arimo',Helvetica] pt-10">Loading podcast...</div>;
  }
  if (error || !podcastInfo) {
    return <div className="w-full text-center text-red-500 [font-family:'Arimo',Helvetica] pt-10">{error}</div>;
  }

  return (
    <main className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto items-start gap-8 pt-8 pb-0 px-4">
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

        {/* (4) ربط الأزرار بالدوال الجديدة */}
        <button 
          onClick={handleFollow}
          className="all-[unset] box-border w-full h-10 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-700"
        >
          <FollowIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Follow</span>
        </button>
        <button 
          onClick={handleFavorite}
          className="all-[unset] box-border w-full h-10 flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-100"
        >
          <FavoriteIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Favorite</span>
        </button>
        <button 
          onClick={handleLike}
          className="all-[unset] box-border w-full h-10 flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-100"
        >
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
                : "border-transparent text-gray-500 hover:text-gray-700"
            } [font-family:'Arimo-Regular',Helvetica] font-normal text-base transition-colors duration-200`}
          >
            Episodes
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`py-2 px-1 border-b-2 ${
              activeTab === "comments"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            } [font-family:'Arimo-Regular',Helvetica] font-normal text-base transition-colors duration-200`}
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
                  className="flex items-center p-4 border border-gray-200 rounded-lg transition-shadow duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => handlePlay(episode)} 
                    className="all-[unset] box-border w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 mr-4 cursor-pointer transition-colors duration-200 hover:bg-gray-200"
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
  );
};