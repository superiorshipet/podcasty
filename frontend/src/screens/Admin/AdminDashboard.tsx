import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { AdminStats, User } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type Tab = "stats" | "users" | "podcasts";

interface AdminPodcast {
    podcastId: number;
    creatorId: number;
    categoryId: number;
    title: string;
    description: string;
    coverImage: string;
    status: number;
    playCount: number;
    createdAt: string;
    updatedAt: string;
    isApproved: boolean;
    creator?: { id: number; userName: string };
}



interface AdminEpisode {
    episodeId: number;
    podcastId: number;
    title: string;
    description: string;
    duration: number;
    playCount: number;
    publishedAt: string;
    isApproved: boolean;
    podcast?: { title: string };
}

export const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<Tab>("stats");
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [podcasts, setPodcasts] = useState<AdminPodcast[]>([]);
    const [episodes, setEpisodes] = useState<AdminEpisode[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        show: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isLoading: boolean;
    }>({ show: false, title: "", message: "", onConfirm: () => { }, isLoading: false });

    useEffect(() => {
        const isAdmin = user?.role && String(user.role).toLowerCase() === "admin";
        if (!isAdmin) {
            navigate("/");
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsData, usersData, podcastsData] = await Promise.all([
                api.admin.getStats(),
                api.admin.getUsers(),
                api.admin.getPodcasts()
            ]);
            setStats(statsData);
            setUsers(Array.isArray(usersData) ? usersData : []);
            setPodcasts(Array.isArray(podcastsData) ? podcastsData : []);
        } catch (err) {
            console.error("Admin Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // User Management Functions
    const handleBan = async (userId: number, currentStatus: boolean) => {
        try {
            await api.admin.banUser(userId, !currentStatus);
            setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !currentStatus } : u));
        } catch (err) {
            alert("Failed to update user status");
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            await api.admin.changeRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            alert("Failed to change role");
        }
    };

    const handleDeleteUser = (userId: number) => {
        const userName = users.find(u => u.id === userId)?.userName || "this user";
        setConfirmModal({
            show: true,
            title: "Delete User",
            message: `Are you sure you want to delete "${userName}" and all their data? This action cannot be undone.`,
            isLoading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isLoading: true }));
                try {
                    await api.admin.deleteUser(userId);
                    setUsers(users.filter(u => u.id !== userId));
                    setConfirmModal({ show: false, title: "", message: "", onConfirm: () => { }, isLoading: false });
                } catch (err) {
                    alert("Failed to delete user");
                    setConfirmModal(prev => ({ ...prev, isLoading: false }));
                }
            }
        });
    };

    // Podcast Management Functions
    const handleDeletePodcast = (podcastId: number) => {
        const podcastTitle = podcasts.find(p => p.podcastId === podcastId)?.title || "this podcast";
        setConfirmModal({
            show: true,
            title: "Delete Podcast",
            message: `Are you sure you want to delete "${podcastTitle}" and all its episodes? This action cannot be undone.`,
            isLoading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isLoading: true }));
                try {
                    await api.admin.deletePodcast(podcastId);
                    setPodcasts(podcasts.filter(p => p.podcastId !== podcastId));
                    setConfirmModal({ show: false, title: "", message: "", onConfirm: () => { }, isLoading: false });
                } catch (err) {
                    alert("Failed to delete podcast");
                    setConfirmModal(prev => ({ ...prev, isLoading: false }));
                }
            }
        });
    };

    const handleApprovePodcast = async (podcastId: number, currentStatus: boolean) => {
        try {
            await api.admin.approvePodcast(podcastId, !currentStatus);
            setPodcasts(podcasts.map(p => p.podcastId === podcastId ? { ...p, isApproved: !currentStatus } : p));
        } catch (err) {
            alert("Failed to update approval status");
        }
    };

    // Episodes Management
    const fetchEpisodes = async () => {
        try {
            const data = await api.admin.getEpisodes();
            setEpisodes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load episodes", err);
        }
    };

    const handleDeleteEpisode = (episodeId: number) => {
        const episodeTitle = episodes.find(e => e.episodeId === episodeId)?.title || "this episode";
        setConfirmModal({
            show: true,
            title: "Delete Episode",
            message: `Are you sure you want to delete "${episodeTitle}"? This action cannot be undone.`,
            isLoading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isLoading: true }));
                try {
                    await api.admin.deleteEpisode(episodeId);
                    setEpisodes(episodes.filter(e => e.episodeId !== episodeId));
                    setConfirmModal({ show: false, title: "", message: "", onConfirm: () => { }, isLoading: false });
                } catch (err) {
                    alert("Failed to delete episode");
                    setConfirmModal(prev => ({ ...prev, isLoading: false }));
                }
            }
        });
    };

    useEffect(() => {
        if (activeTab === "episodes" && episodes.length === 0) {
            fetchEpisodes();
        }
    }, [activeTab]);

    // Filter users based on search
    const filteredUsers = users.filter(u =>
        u.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">Loading Admin Dashboard...</div>;

    return (
        <main className="w-full max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => {
                        fetchData();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    Refresh All
                </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 mb-8 border-b pb-4 flex-wrap">
                {[
                    { id: "stats", label: "Statistics" },
                    { id: "users", label: "Users" },
                    { id: "podcasts", label: "Podcasts" },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Stats Tab */}
            {activeTab === "stats" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Users</h3>
                        <p className="text-3xl font-bold text-blue-700 mt-2">{stats?.totalUsers || 0}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Podcasts</h3>
                        <p className="text-3xl font-bold text-green-700 mt-2">{stats?.totalPodcasts || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Episodes</h3>
                        <p className="text-3xl font-bold text-purple-700 mt-2">{stats?.totalEpisodes || 0}</p>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Plays</h3>
                        <p className="text-3xl font-bold text-yellow-700 mt-2">{stats?.totalPodcastPlays || 0}</p>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold">User Management</h2>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {filteredUsers.length === 0 ? (
                        <p className="p-6 text-gray-500 text-center">No users found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-gray-100 text-gray-600 text-sm uppercase font-semibold">
                                    <tr>
                                        <th className="p-4">User</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                                                    {u.userName ? u.userName[0].toUpperCase() : 'U'}
                                                </div>
                                                {u.userName}
                                            </td>
                                            <td className="p-4 text-gray-500">{u.email}</td>
                                            <td className="p-4">
                                                {u.isBanned ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Banned</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center space-x-2">
                                                <button
                                                    onClick={() => handleBan(u.id, u.isBanned || false)}
                                                    className={`text-xs font-bold uppercase px-3 py-1 rounded shadow-sm transition-all ${u.isBanned ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-orange-600 text-white hover:bg-orange-700'
                                                        }`}
                                                >
                                                    {u.isBanned ? "Unban" : "Ban"}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="text-xs font-bold uppercase px-3 py-1 rounded shadow-sm bg-red-600 text-white hover:bg-red-700 transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Podcasts Tab */}
            {activeTab === "podcasts" && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-6 border-b bg-gray-50">
                        <h2 className="text-xl font-bold">Podcast Management</h2>
                    </div>
                    {podcasts.length === 0 ? (
                        <p className="p-6 text-gray-500 text-center">No podcasts found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-gray-100 text-gray-600 text-sm uppercase font-semibold">
                                    <tr>
                                        <th className="p-4">Podcast</th>
                                        <th className="p-4">Creator</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Approved</th>
                                        <th className="p-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {podcasts.map(p => (
                                        <tr key={p.podcastId} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                                                {p.coverImage && (
                                                    <img src={p.coverImage} alt={p.title} className="w-10 h-10 rounded object-cover" />
                                                )}
                                                <div>
                                                    <div className="font-semibold">{p.title}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-xs">{p.description}</div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-500">{p.creator?.userName || "Unknown"}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${Number(p.status) === 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                                    {Number(p.status) === 0 ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleApprovePodcast(p.podcastId, Boolean(p.isApproved))}
                                                    className={`text-xs font-bold uppercase px-3 py-1 rounded transition-all ${Boolean(p.isApproved)
                                                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                        }`}
                                                >
                                                    {Boolean(p.isApproved) ? "✓ Approved" : "Pending"}
                                                </button>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleDeletePodcast(p.podcastId)}
                                                    className="text-xs font-bold uppercase px-3 py-1 rounded shadow-sm bg-red-600 text-white hover:bg-red-700 transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Episodes Tab */}
            {activeTab === "episodes" && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Episode Management</h2>
                        <button
                            onClick={fetchEpisodes}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            🔄 Refresh
                        </button>
                    </div>
                    {episodes.length === 0 ? (
                        <p className="p-6 text-gray-500 text-center">No episodes found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-gray-100 text-gray-600 text-sm uppercase font-semibold">
                                    <tr>
                                        <th className="p-4">Episode</th>
                                        <th className="p-4">Podcast ID</th>
                                        <th className="p-4">Duration</th>
                                        <th className="p-4">Plays</th>
                                        <th className="p-4">Published</th>
                                        <th className="p-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {episodes.map(ep => (
                                        <tr key={ep.episodeId} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900">{ep.title}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-xs">{ep.description}</div>
                                            </td>
                                            <td className="p-4 text-gray-500">#{ep.podcastId}</td>
                                            <td className="p-4 text-gray-500">{Math.floor(ep.duration / 60)}:{String(ep.duration % 60).padStart(2, '0')}</td>
                                            <td className="p-4 text-gray-500">{ep.playCount}</td>
                                            <td className="p-4 text-gray-500">{new Date(ep.publishedAt).toLocaleDateString()}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleDeleteEpisode(ep.episodeId)}
                                                    className="text-xs font-bold uppercase px-3 py-1 rounded shadow-sm bg-red-600 text-white hover:bg-red-700 transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
                        <p className="text-gray-600 mb-6">{confirmModal.message}</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setConfirmModal({ show: false, title: "", message: "", onConfirm: () => { }, isLoading: false })}
                                disabled={confirmModal.isLoading}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                disabled={confirmModal.isLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {confirmModal.isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};