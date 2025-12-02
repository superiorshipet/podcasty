import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { AdminStats, User } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "Admin") {
        navigate("/");
        return;
    }

    const fetchData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          api.admin.getStats(),
          api.admin.getUsers()
        ]);
        setStats(statsData);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

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
      } catch(err) {
          alert("Failed to change role");
      }
  }

  if (loading) return <div className="p-8 text-center">Loading Admin Dashboard...</div>;

  return (
    <main className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Users</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">{stats?.totalUsers}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Podcasts</h3>
            <p className="text-3xl font-bold text-green-700 mt-2">{stats?.totalPodcasts}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Episodes</h3>
            <p className="text-3xl font-bold text-purple-700 mt-2">{stats?.totalEpisodes}</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Plays</h3>
            <p className="text-3xl font-bold text-yellow-700 mt-2">{stats?.totalPodcastPlays}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <h2 className="text-xl font-bold p-6 border-b bg-gray-50">User Management</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-100 text-gray-600 text-sm uppercase font-semibold">
                    <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                                    {u.userName[0].toUpperCase()}
                                </div>
                                {u.userName}
                            </td>
                            <td className="p-4 text-gray-500">{u.email}</td>
                            <td className="p-4">
                                <select 
                                    value={u.role} 
                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                    className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="User">User</option>
                                    <option value="Creator">Creator</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </td>
                            <td className="p-4">
                                {u.isBanned ? 
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Banned</span> : 
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                                }
                            </td>
                            <td className="p-4 text-center">
                                <button 
                                    onClick={() => handleBan(u.id, u.isBanned || false)}
                                    className={`text-xs font-bold uppercase px-3 py-1 rounded shadow-sm transition-all ${u.isBanned ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
                                >
                                    {u.isBanned ? "Unban" : "Ban"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </main>
  );
};