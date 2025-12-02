import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePlayer } from "../../contexts/PlayerContext";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { Podcast as PodcastType, Episode, UserInteraction } from "../../types";

// Icons (Play, Pause, etc) - Keep existing ones
const PlayIcon = ({ className }: { className: string }) => (<svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 4.31A1.2 1.2 0 0 0 4.5 5.5v9a1.2 1.2 0 0 0 1.8 1.09l7.2-4.5a1.2 1.2 0 0 0 0-2.18l-7.2-4.5Z" /></svg>);
// ... Add other icons here

export const Podcast = (): JSX.Element => {
  const { podcastId } = useParams();
  const { playTrack } = usePlayer();
  const { user, openLoginModal } = useAuth();

  const [podcast, setPodcast] = useState<PodcastType | null>(null);
  const [comments, setComments] = useState<UserInteraction[]>([]);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState<'episodes' | 'comments'>('episodes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const pId = Number(podcastId);

  useEffect(() => {
    if (!pId) return;
    const loadData = async () => {
        setLoading(true);
        try {
            const podData = await api.podcasts.getById(pId);
            setPodcast(podData);
            
            // Load comments
            const commentsData = await api.interactions.getComments(pId);
            // Ensure it's an array
            setComments(Array.isArray(commentsData) ? commentsData : []);
        } catch (e: any) { 
            console.error(e); 
            setError(e.message);
        } 
        finally { setLoading(false); }
    };
    loadData();
  }, [pId]);

  const handleAction = async (action: 'like' | 'favorite' | 'follow') => {
      if (!user) return openLoginModal();
      try {
          if (action === 'like') await api.interactions.like(user.id, pId);
          if (action === 'favorite') await api.interactions.favorite(user.id, pId);
          if (action === 'follow') await api.interactions.follow(user.id, pId);
          alert(`${action} successful!`);
      } catch (e) { alert(`Failed to ${action}`); }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return openLoginModal();
    if (!newComment.trim()) return;

    try {
        await api.interactions.comment(user.id, pId, newComment);
        setNewComment("");
        const updatedComments = await api.interactions.getComments(pId);
        setComments(Array.isArray(updatedComments) ? updatedComments : []);
    } catch (e) { alert("Failed to post comment"); }
  };

  const handlePlay = (episode: Episode) => {
      if (!user) return openLoginModal();
      if (podcast) playTrack(episode, podcast);
      // Add to history API can be called here too
      // api.history.add({ episodeId: episode.episodeId, ... });
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (error || !podcast) return <div className="p-20 text-center text-red-500">Error: {error || "Podcast not found"}</div>;

  return (
    <div className="bg-white min-h-screen pb-12">
      <main className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto items-start gap-8 pt-8 px-4">
        {/* Left Info */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col items-center lg:items-start gap-4">
            <img src={podcast.coverImage || "https://placehold.co/300x300?text=No+Image"} className="w-full h-auto rounded-xl shadow-lg object-cover" alt="cover" />
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{podcast.title}</h2>
                {/* Assuming creator object exists, otherwise show creatorId */}
                <p className="text-gray-600">by {podcast.creator?.userName || `Creator #${podcast.creatorId}`}</p>
            </div>

            <div className="flex flex-col w-full gap-2">
                <button onClick={() => handleAction('follow')} className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition">Follow Podcast</button>
                <div className="flex gap-2">
                    <button onClick={() => handleAction('like')} className="flex-1 border border-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition">Like</button>
                    <button onClick={() => handleAction('favorite')} className="flex-1 border border-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition">Favorite</button>
                </div>
            </div>
            
            <div className="w-full pt-4 border-t border-gray-100">
                <h4 className="font-bold text-sm uppercase text-gray-500 mb-2">About</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{podcast.description}</p>
            </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 w-full">
            <div className="flex border-b mb-6">
                <button onClick={() => setActiveTab('episodes')} className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'episodes' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}>Episodes ({podcast.episodes?.length || 0})</button>
                <button onClick={() => setActiveTab('comments')} className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'comments' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}>Comments</button>
            </div>

            {activeTab === 'episodes' && (
                <div className="space-y-4">
                    {podcast.episodes?.map(ep => (
                        <div key={ep.episodeId} className="flex items-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all bg-white group">
                            <button onClick={() => handlePlay(ep)} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-black group-hover:text-white transition-colors">
                                <PlayIcon className="w-5 h-5" />
                            </button>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{ep.title}</h4>
                                <p className="text-sm text-gray-500 line-clamp-1">{ep.description}</p>
                                <span className="text-xs text-gray-400 mt-1 block">{ep.duration} mins {ep.publishedAt ? `• ${new Date(ep.publishedAt).toLocaleDateString()}` : ''}</span>
                            </div>
                        </div>
                    ))}
                    {(!podcast.episodes || podcast.episodes.length === 0) && <p className="text-gray-500 text-center py-8">No episodes yet.</p>}
                </div>
            )}

            {activeTab === 'comments' && (
                <div>
                    <form onSubmit={handleComment} className="mb-8 flex gap-2">
                        <input 
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="bg-blue-600 text-white px-6 rounded-lg font-medium hover:bg-blue-700 transition">Post</button>
                    </form>
                    <div className="space-y-4">
                        {comments.map(c => (
                            <div key={c.interactionId} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="font-bold text-sm text-gray-900">{c.user?.userName || `User #${c.userId}`}</p>
                                    <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-700 text-sm">{c.commentContent}</p>
                            </div>
                        ))}
                        {comments.length === 0 && <p className="text-gray-500 text-center py-8">Be the first to comment!</p>}
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};