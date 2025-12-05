import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { PlayHistory } from "../../types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface FollowedPodcast {
  interactionId: number;
  podcastId: number;
  title: string;
  description: string;
  coverImage: string;
  creatorId: number;
  categoryId: number;
  playCount: number;
  followedAt: string;
}

interface FavoritedPodcast {
  interactionId: number;
  podcastId: number;
  title: string;
  description: string;
  coverImage: string;
  creatorId: number;
  categoryId: number;
  playCount: number;
  favoritedAt: string;
}

export const MyLibrary = (): JSX.Element => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [history, setHistory] = useState<PlayHistory[]>([]);
  const [followedPodcasts, setFollowedPodcasts] = useState<FollowedPodcast[]>([]);
  const [favoritedPodcasts, setFavoritedPodcasts] = useState<FavoritedPodcast[]>([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('following');

  const handleUnfollow = async (interactionId: number) => {
    try {
      await api.interactions.deleteInteraction(interactionId);
      setFollowedPodcasts(prev => prev.filter(p => p.interactionId !== interactionId));
    } catch (e) {
      console.error('Failed to unfollow:', e);
    }
  };

  const handleRemoveFavorite = async (interactionId: number) => {
    try {
      await api.interactions.deleteInteraction(interactionId);
      setFavoritedPodcasts(prev => prev.filter(p => p.interactionId !== interactionId));
    } catch (e) {
      console.error('Failed to remove favorite:', e);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          api.history.getMine(),
          api.library.getFollowing(),
          api.library.getFavorites()
        ]);

        if (results[0].status === 'fulfilled') {
          const historyData = results[0].value;
          setHistory(Array.isArray(historyData) ? historyData : []);
        }

        if (results[1].status === 'fulfilled') {
          const followingData = results[1].value;
          setFollowedPodcasts(Array.isArray(followingData) ? followingData : []);
        }

        if (results[2].status === 'fulfilled') {
          const favoritesData = results[2].value;
          setFavoritedPodcasts(Array.isArray(favoritesData) ? favoritesData : []);
        }

      } catch (e) {
        console.error("Failed to load library data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="p-10 text-center">Loading Library...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Library</h1>

      {/* Tabs */}
      <div className="flex w-full border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-6 text-sm font-medium transition-colors ${activeTab === 'history' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
        >
          Listening History ({history.length})
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`py-3 px-6 text-sm font-medium transition-colors ${activeTab === 'following' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
        >
          Following ({followedPodcasts.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-3 px-6 text-sm font-medium transition-colors ${activeTab === 'favorites' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
        >
          Favorites ({favoritedPodcasts.length})
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length > 0 ? history.map(item => (
              <div key={item.historyId} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
                <div>
                  <h4 className="font-bold">{item.episodeTitle || `Episode ID: ${item.episodeId}`}</h4>
                  <p className="text-xs text-gray-500">Last played: {new Date(item.lastPlayed).toLocaleDateString()}</p>
                </div>
                <button onClick={() => navigate(`/podcast/${item.episodeId}`)} className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
              </div>
            )) : <p className="text-gray-500">You haven't listened to anything recently.</p>}
          </div>
        )}

        {activeTab === 'following' && (
          <div>
            {followedPodcasts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {followedPodcasts.map((podcast) => (
                  <div key={podcast.interactionId} className="relative group">
                    <div className="w-full aspect-square rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      <img
                        src={podcast.coverImage || "https://placehold.co/200x200?text=No+Image"}
                        alt={podcast.title}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => navigate(`/podcast/${podcast.podcastId}`)}
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-semibold text-gray-900 truncate">{podcast.title}</p>
                    </div>
                    <button
                      onClick={() => handleUnfollow(podcast.interactionId)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      title="Unfollow"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">You are not following any podcasts yet.</p>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            {favoritedPodcasts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favoritedPodcasts.map((podcast) => (
                  <div key={podcast.interactionId} className="relative group">
                    <div className="w-full aspect-square rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow ring-2 ring-yellow-400">
                      <img
                        src={podcast.coverImage || "https://placehold.co/200x200?text=No+Image"}
                        alt={podcast.title}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => navigate(`/podcast/${podcast.podcastId}`)}
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-semibold text-gray-900 truncate">{podcast.title}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(podcast.interactionId)}
                      className="absolute top-2 right-2 bg-yellow-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-yellow-600"
                      title="Remove from favorites"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">You have no favorite podcasts yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};