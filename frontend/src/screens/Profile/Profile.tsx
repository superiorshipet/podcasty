import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { Podcast } from "../../types";

export const Profile = (): JSX.Element => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loadingPodcasts, setLoadingPodcasts] = useState(true);

  const handleMyPodcastsClick = () => {
    navigate("/creator/dashboard");
  };

  // Fetch user's podcasts
  useEffect(() => {
    const fetchUserPodcasts = async () => {
      if (!user) return;
      try {
        const allPodcasts = await api.podcasts.getAll();
        const userPodcasts = allPodcasts.filter((p: Podcast) => p.creatorId === user.id);
        setPodcasts(userPodcasts);
      } catch (err) {
        console.error("Failed to fetch podcasts", err);
      } finally {
        setLoadingPodcasts(false);
      }
    };
    fetchUserPodcasts();
  }, [user]);

  if (!user) {
    return (
      <main className="w-full max-w-6xl mx-auto pt-8 px-4 [font-family:'Arimo',Helvetica]">
        Loading profile...
      </main>
    );
  }

  const initialLetter = user.userName ? user.userName[0].toUpperCase() : "P";

  return (
    <div className="bg-white overflow-x-hidden w-full min-h-screen relative">

      <main className="flex flex-col w-full max-w-6xl mx-auto items-start gap-8 pt-8 pb-12 px-4">

        {/* --- User Info Section --- */}
        <section className="relative self-stretch w-full h-auto pb-8 border-b-[0.8px] [border-bottom-style:solid] border-[#0000001a] flex flex-col md:flex-row items-center">

          <div
            className="flex w-24 h-24 items-center justify-center flex-shrink-0 bg-[#ececf0] rounded-full overflow-hidden"
            aria-hidden="true"
          >
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="[font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-2xl tracking-[0] leading-8">
                {initialLetter}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center md:items-start md:ml-6 mt-4 md:mt-0">
            <h2 className="[font-family:'Arimo-Regular',Helvetica] font-bold text-neutral-950 text-2xl tracking-[0] leading-6">
              {user.userName}
            </h2>
            <p className="mt-2 [font-family:'Arimo-Regular',Helvetica] font-normal text-[#495565] text-base tracking-[0] leading-6">
              {user.bio || "No bio available."}
            </p>
          </div>

          {/* --- Button Group --- */}
          <div className="flex items-center gap-4 md:ml-auto mt-4 md:mt-0">

            {/* زر My Podcasts */}
            <button
              onClick={handleMyPodcastsClick}
              className="all-[unset] box-border flex w-auto h-9 items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg cursor-pointer text-sm [font-family:'Arimo-Regular',Helvetica] transition-colors hover:bg-gray-50"
              type="button"
              aria-label="My Podcasts"
            >
              <span>My Podcasts</span>
            </button>

            {/* زر Edit Profile */}
            <button
              onClick={() => navigate("/edit-profile")}
              className="all-[unset] box-border flex w-auto h-9 items-center justify-center gap-2 px-4 py-2 bg-[#8b22b0] rounded-lg cursor-pointer text-white text-sm [font-family:'Arimo-Regular',Helvetica] transition-opacity hover:bg-opacity-90"
              type="button"
              aria-label="Edit your profile"
            >
              <span>Edit Profile</span>
            </button>
          </div>
        </section>

        {/* --- My Podcasts Section --- */}
        <section className="flex flex-col items-start gap-4 relative self-stretch w-full">
          <h3 className="text-xl font-bold text-gray-900">
            My Podcasts
          </h3>

          {loadingPodcasts ? (
            <p className="text-gray-500">Loading podcasts...</p>
          ) : podcasts.length === 0 ? (
            <div className="w-full p-8 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-600">You haven't created any podcasts yet.</p>
              <button
                onClick={() => navigate("/creator/dashboard")}
                className="mt-4 px-4 py-2 bg-[#8b22b0] text-white rounded-lg hover:bg-[#7a1e9c]"
              >
                Create Your First Podcast
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {podcasts.map(podcast => (
                <div
                  key={podcast.podcastId}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/podcast/${podcast.podcastId}`)}
                >
                  <div className="h-32 bg-gray-200 overflow-hidden">
                    {podcast.coverImage ? (
                      <img src={podcast.coverImage} alt={podcast.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 truncate">{podcast.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{podcast.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span>{(podcast as any).playCount || 0} plays</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};