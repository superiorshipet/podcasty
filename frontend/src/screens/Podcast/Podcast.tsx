import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlayer } from "../../contexts/PlayerContext";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { Podcast as PodcastType, Episode, UserInteraction } from "../../types";

const PlayIcon = React.memo(({ className }: { className: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M6.3 4.31A1.2 1.2 0 0 0 4.5 5.5v9a1.2 1.2 0 0 0 1.8 1.09l7.2-4.5a1.2 1.2 0 0 0 0-2.18l-7.2-4.5Z" />
    </svg>
));

const INTERACTION_TYPES = {
    LIKE: 0, FAVORITE: 1, FOLLOW: 2, COMMENT: 3, DISLIKE: 4
};

const formatDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const normalizeInteractionType = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const normalized = value.toLowerCase();
        if (normalized === 'like') return INTERACTION_TYPES.LIKE;
        if (normalized === 'favorite') return INTERACTION_TYPES.FAVORITE;
        if (normalized === 'follow') return INTERACTION_TYPES.FOLLOW;
        if (normalized === 'comment') return INTERACTION_TYPES.COMMENT;
        if (normalized === 'dislike') return INTERACTION_TYPES.DISLIKE;
        return parseInt(value, 10);
    }
    return NaN;
};

interface PodcastStats {
    podcastId: number;
    likesCount: number;
    followersCount: number;
    playCount: number;
}

// Memoized Episode Card component
const EpisodeCard = React.memo(({
    ep, onPlay, canEdit, onEdit, onDelete
}: {
    ep: Episode;
    onPlay: (ep: Episode) => void;
    canEdit: boolean;
    onEdit: (ep: Episode) => void;
    onDelete: (epId: number) => void;
}) => (
    <div className="flex items-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all bg-white group">
        <button onClick={() => onPlay(ep)} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-black group-hover:text-white transition-colors">
            <PlayIcon className="w-5 h-5" />
        </button>
        <div className="flex-1">
            <h4 className="font-bold text-gray-900">{ep.title}</h4>
            <p className="text-sm text-gray-500 line-clamp-1">{ep.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                <span>{formatDuration(ep.duration)}</span>
                {ep.publishedAt && <span>• {new Date(ep.publishedAt).toLocaleDateString()}</span>}
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    {(ep as any).playCount || 0} listens
                </span>
            </div>
        </div>
        {canEdit && (
            <div className="flex gap-2 ml-4">
                <button onClick={() => onEdit(ep)} className="p-2 text-gray-500 hover:text-[#8b22b0] hover:bg-gray-100 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button onClick={() => onDelete(ep.episodeId)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        )}
    </div>
));

export const Podcast = (): JSX.Element => {
    const { podcastId } = useParams();
    const navigate = useNavigate();
    const { playTrack } = usePlayer();
    const { user, openLoginModal } = useAuth();

    const [podcast, setPodcast] = useState<PodcastType | null>(null);
    const [stats, setStats] = useState<PodcastStats | null>(null);
    const [comments, setComments] = useState<UserInteraction[]>([]);
    const [newComment, setNewComment] = useState("");
    const [activeTab, setActiveTab] = useState<'episodes' | 'comments'>('episodes');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const [showEditPodcast, setShowEditPodcast] = useState(false);
    const [showEditEpisode, setShowEditEpisode] = useState(false);
    const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
    const [editPodcastData, setEditPodcastData] = useState<{ title?: string; description?: string; coverImage?: string }>({ title: "", description: "", coverImage: "" });
    const [editEpisodeData, setEditEpisodeData] = useState<{ title?: string; description?: string }>({ title: "", description: "" });

    const [interactionStatus, setInteractionStatus] = useState({
        isLiked: false, isFollowed: false, isFavorited: false,
    });

    // State for custom confirm modal with loading
    const [confirmModal, setConfirmModal] = useState<{
        show: boolean;
        title: string;
        message: string;
        isLoading: boolean;
        onConfirm: () => void;
    }>({ show: false, title: "", message: "", isLoading: false, onConfirm: () => { } });

    const pId = Number(podcastId);

    // Memoize computed values
    const isOwner = useMemo(() => !!(user && podcast && user.id === podcast.creatorId), [user, podcast]);
    const isAdmin = useMemo(() => !!(user?.role && String(user.role).toLowerCase() === "admin"), [user?.role]);
    const canEdit = useMemo(() => !!(isOwner || isAdmin), [isOwner, isAdmin]);

    // Memoize API calls with useCallback
    const checkUserInteractions = useCallback(async (pid: number) => {
        if (!user) {
            setInteractionStatus({ isLiked: false, isFollowed: false, isFavorited: false });
            return;
        }
        try {
            const allUserInteractions = await api.interactions.getByUser();
            if (!Array.isArray(allUserInteractions)) return;
            const currentPodInteractions = allUserInteractions.filter((i: any) => i.podcastId === pid);
            setInteractionStatus({
                isLiked: currentPodInteractions.some((i: any) => normalizeInteractionType(i.interaction) === INTERACTION_TYPES.LIKE),
                isFollowed: currentPodInteractions.some((i: any) => normalizeInteractionType(i.interaction) === INTERACTION_TYPES.FOLLOW),
                isFavorited: currentPodInteractions.some((i: any) => normalizeInteractionType(i.interaction) === INTERACTION_TYPES.FAVORITE),
            });
        } catch (e) {
            console.error("Failed to check user interaction status:", e);
        }
    }, [user]);

    // Optimized data loading with Promise.all
    useEffect(() => {
        if (!pId) return;
        const loadAllData = async () => {
            setLoading(true);
            try {
                // Parallel fetch for faster loading
                const [podData, statsData, commentsData] = await Promise.all([
                    api.podcasts.getById(pId),
                    api.podcasts.getStats(pId),
                    api.interactions.getComments(pId)
                ]);

                setPodcast(podData);
                setEditPodcastData({ title: podData.title, description: podData.description, coverImage: podData.coverImage || "" });
                setStats(statsData);
                setComments(Array.isArray(commentsData) ? commentsData : []);

                // Check interactions after main data loads
                if (user) await checkUserInteractions(pId);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        loadAllData();
    }, [pId, user, checkUserInteractions]);

    const handleAction = useCallback(async (action: 'like' | 'favorite' | 'follow') => {
        if (!user) return openLoginModal();
        try {
            await (action === 'like' ? api.interactions.like(pId) : action === 'favorite' ? api.interactions.favorite(pId) : api.interactions.follow(pId));
            // Parallel refresh
            await Promise.all([checkUserInteractions(pId), api.podcasts.getStats(pId).then(setStats)]);
        } catch (e: any) {
            console.error(`Failed to perform ${action}: ${e.message}`);
        }
    }, [user, pId, openLoginModal, checkUserInteractions]);

    const handleComment = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return openLoginModal();
        if (!newComment.trim()) return;
        if (isSubmittingComment) return;

        setIsSubmittingComment(true);
        try {
            await api.interactions.comment(pId, newComment);
            setNewComment("");
            const updatedComments = await api.interactions.getComments(pId);
            setComments(Array.isArray(updatedComments) ? updatedComments : []);
        } catch (e) {
            console.error("Failed to post comment", e);
        } finally {
            setIsSubmittingComment(false);
        }
    }, [user, pId, newComment, openLoginModal, isSubmittingComment]);

    const handlePlay = useCallback((episode: Episode) => {
        if (!user) return openLoginModal();
        if (podcast) playTrack(episode, podcast);
    }, [user, podcast, playTrack, openLoginModal]);

    const handleUpdatePodcast = useCallback(async () => {
        if (!canEdit) return;
        try {
            await api.podcasts.update(pId, editPodcastData);
            setPodcast({ ...podcast!, ...editPodcastData });
            setShowEditPodcast(false);
            alert("Podcast updated successfully!");
        } catch (e) {
            alert("Failed to update podcast");
        }
    }, [canEdit, pId, editPodcastData, podcast]);

    const handleDeletePodcast = useCallback(() => {
        if (!canEdit) return;

        setConfirmModal({
            show: true,
            title: "Delete Podcast",
            message: "Are you sure you want to delete this podcast? This action cannot be undone.",
            isLoading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isLoading: true }));
                try {
                    await api.podcasts.delete(pId);
                    setConfirmModal(prev => ({ ...prev, show: false, isLoading: false }));
                    alert("Podcast deleted successfully!");
                    navigate("/");
                } catch (e: any) {
                    console.error("Delete failed:", e);
                    setConfirmModal(prev => ({ ...prev, isLoading: false }));
                    alert("Failed to delete podcast: " + e.message);
                }
            }
        });
    }, [canEdit, pId, navigate]);

    const openEditEpisode = useCallback((ep: Episode) => {
        setEditingEpisode(ep);
        setEditEpisodeData({ title: ep.title, description: ep.description });
        setShowEditEpisode(true);
    }, []);

    const handleUpdateEpisode = useCallback(async () => {
        if (!canEdit || !editingEpisode) return;
        try {
            await api.episodes.update(editingEpisode.episodeId, editEpisodeData);
            // Update UI directly without refetching
            if (podcast?.episodes) {
                const updatedEpisodes = podcast.episodes.map(ep =>
                    ep.episodeId === editingEpisode.episodeId
                        ? { ...ep, ...editEpisodeData }
                        : ep
                );
                setPodcast({ ...podcast, episodes: updatedEpisodes });
            }
            setShowEditEpisode(false);
            setEditingEpisode(null);
            alert("Episode updated successfully!");
        } catch (e) {
            console.error("Update failed:", e);
            alert("Failed to update episode");
        }
    }, [canEdit, editingEpisode, editEpisodeData, podcast]);

    const handleDeleteEpisode = useCallback((epId: number) => {
        if (!canEdit) return;

        setConfirmModal({
            show: true,
            title: "Delete Episode",
            message: "Are you sure you want to delete this episode? This action cannot be undone.",
            isLoading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isLoading: true }));
                try {
                    await api.episodes.delete(epId);
                    if (podcast?.episodes) {
                        setPodcast({ ...podcast, episodes: podcast.episodes.filter(ep => ep.episodeId !== epId) });
                    }
                    setConfirmModal(prev => ({ ...prev, show: false, isLoading: false }));
                    alert("Episode deleted!");
                } catch (e: any) {
                    console.error("Delete failed:", e);
                    setConfirmModal(prev => ({ ...prev, isLoading: false }));
                    alert("Failed to delete episode: " + e.message);
                }
            }
        });
    }, [canEdit, podcast]);

    const handleDeleteComment = useCallback((interactionId: number) => {
        if (!isAdmin) return;

        setConfirmModal({
            show: true,
            title: "Delete Comment",
            message: "Are you sure you want to delete this comment?",
            isLoading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isLoading: true }));
                try {
                    await api.interactions.deleteInteraction(interactionId);
                    setComments(prev => prev.filter(c => c.interactionId !== interactionId));
                    setConfirmModal(prev => ({ ...prev, show: false, isLoading: false }));
                } catch (e: any) {
                    console.error("Delete failed:", e);
                    setConfirmModal(prev => ({ ...prev, isLoading: false }));
                    alert("Failed to delete comment: " + e.message);
                }
            }
        });
    }, [isAdmin]);

    if (loading) return <div className="p-20 text-center">Loading...</div>;
    if (error || !podcast) return <div className="p-20 text-center text-red-500">Error: {error || "Podcast not found"}</div>;

    return (
        <div className="bg-white min-h-screen pb-12">
            {/* Custom Confirm Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900">{confirmModal.title}</h3>
                        <p className="text-gray-600">{confirmModal.message}</p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                                disabled={confirmModal.isLoading}
                                className="flex-1 border border-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                disabled={confirmModal.isLoading}
                                className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {confirmModal.isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Podcast Modal */}
            {showEditPodcast && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">Edit Podcast</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input value={editPodcastData.title} onChange={e => setEditPodcastData({ ...editPodcastData, title: e.target.value })} className="w-full border p-2 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea value={editPodcastData.description} onChange={e => setEditPodcastData({ ...editPodcastData, description: e.target.value })} className="w-full border p-2 rounded-lg h-24" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                            <input value={editPodcastData.coverImage} onChange={e => setEditPodcastData({ ...editPodcastData, coverImage: e.target.value })} className="w-full border p-2 rounded-lg" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleUpdatePodcast} className="flex-1 bg-[#8b22b0] text-white py-2 rounded-lg hover:bg-[#7a1e9c]">Save</button>
                            <button onClick={() => setShowEditPodcast(false)} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Episode Modal */}
            {showEditEpisode && editingEpisode && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">Edit Episode</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input value={editEpisodeData.title} onChange={e => setEditEpisodeData({ ...editEpisodeData, title: e.target.value })} className="w-full border p-2 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea value={editEpisodeData.description} onChange={e => setEditEpisodeData({ ...editEpisodeData, description: e.target.value })} className="w-full border p-2 rounded-lg h-24" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleUpdateEpisode} className="flex-1 bg-[#8b22b0] text-white py-2 rounded-lg hover:bg-[#7a1e9c]">Save</button>
                            <button onClick={() => { setShowEditEpisode(false); setEditingEpisode(null); }} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto items-start gap-8 pt-8 px-4">
                {/* Left Info */}
                <div className="w-full lg:w-80 flex-shrink-0 flex flex-col items-center lg:items-start gap-4">
                    <div className="relative w-full">
                        <img src={podcast.coverImage || "https://placehold.co/300x300?text=No+Image"} className="w-full h-auto rounded-xl shadow-lg object-cover" alt="cover" loading="lazy" />
                        {canEdit && (
                            <button onClick={() => setShowEditPodcast(true)} className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow hover:bg-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                        )}
                    </div>
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-gray-900">{podcast.title}</h2>
                        <p className="text-gray-600">by {podcast.creator?.userName || `Creator #${podcast.creatorId}`}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 w-full">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                            <span>{stats?.likesCount || 0} likes</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
                            <span>{stats?.followersCount || 0} followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            <span>{stats?.playCount || 0} plays</span>
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <button onClick={() => handleAction('follow')} className={`w-full py-2.5 rounded-lg font-medium transition ${interactionStatus.isFollowed ? 'bg-gray-200 text-gray-800' : 'bg-black text-white hover:opacity-90'}`}>
                            {interactionStatus.isFollowed ? 'Following' : 'Follow Podcast'}
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => handleAction('like')} className={`flex-1 border py-2.5 rounded-lg font-medium transition ${interactionStatus.isLiked ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 hover:bg-gray-50'}`}>
                                {interactionStatus.isLiked ? 'Liked' : 'Like'}
                            </button>
                            <button onClick={() => handleAction('favorite')} className={`flex-1 border py-2.5 rounded-lg font-medium transition ${interactionStatus.isFavorited ? 'bg-yellow-500 text-white border-yellow-500' : 'border-gray-300 hover:bg-gray-50'}`}>
                                {interactionStatus.isFavorited ? 'Favorited' : 'Favorite'}
                            </button>
                        </div>
                    </div>

                    <div className="w-full pt-4 border-t border-gray-100">
                        <h4 className="font-bold text-sm uppercase text-gray-500 mb-2">About</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{podcast.description}</p>
                    </div>

                    {canEdit && (
                        <button onClick={handleDeletePodcast} className="w-full mt-4 border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition">
                            Delete Podcast
                        </button>
                    )}
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
                                <EpisodeCard key={ep.episodeId} ep={ep} onPlay={handlePlay} canEdit={canEdit} onEdit={openEditEpisode} onDelete={handleDeleteEpisode} />
                            ))}
                            {(!podcast.episodes || podcast.episodes.length === 0) && <p className="text-gray-500 text-center py-8">No episodes yet.</p>}
                        </div>
                    )}

                    {activeTab === 'comments' && (
                        <div>
                            <form onSubmit={handleComment} className="mb-8 flex gap-2">
                                <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment..." className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <button type="submit" className="bg-[#8b22b0] text-white px-6 rounded-lg font-medium hover:bg-[#7a1e9c] transition">Post</button>
                            </form>
                            <div className="space-y-4">
                                {comments.map(c => (
                                    <div key={c.interactionId} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-bold text-sm text-gray-900">{c.user?.userName || `User #${c.userId}`}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                                {isAdmin && <button onClick={() => handleDeleteComment(c.interactionId)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>}
                                            </div>
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