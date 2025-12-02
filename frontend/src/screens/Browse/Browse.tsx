import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import { Podcast, Category } from "../../types";

export const Browse = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (categoryIdFromUrl) {
      filterByCategory(parseInt(categoryIdFromUrl));
    }
  }, [categoryIdFromUrl]);

  const loadInitialData = async () => {
    try {
      const [cats, pods] = await Promise.all([
        api.categories.getAll(),
        api.podcasts.getAll()
      ]);
      setCategories(cats);
      setPodcasts(pods);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.search.query(searchQuery);
      setPodcasts(result.podcasts || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const filterByCategory = async (id: number) => {
    setLoading(true);
    try {
      const pods = await api.discovery.filterByCategory(id);
      setPodcasts(pods || []);
    } catch { setPodcasts([]); } 
    finally { setLoading(false); }
  };

  const handleSort = async (value: string) => {
     const [type, order] = value.split('-');
     if(type === 'views' || type === 'time' || type === 'duration') {
        await api.discovery.sort(type, order as 'asc'|'desc');
     }
  };

  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="bg-[#030213] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Find Your Next Obsession</h1>
            <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
                <input 
                    type="text" 
                    placeholder="Search podcasts..." 
                    className="w-full h-12 px-6 rounded-full text-gray-900 focus:outline-none border-2 border-transparent focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors">Search</button>
            </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Categories</h3>
                <div className="flex flex-col gap-1">
                    <button onClick={loadInitialData} className="text-left px-3 py-2 rounded hover:bg-gray-200 text-sm font-medium text-gray-700">All Podcasts</button>
                    {categories.map(cat => (
                        <button 
                            key={cat.categoryId} 
                            onClick={() => cat.categoryId && filterByCategory(cat.categoryId)}
                            className={`text-left px-3 py-2 rounded hover:bg-gray-200 text-sm font-medium transition-colors ${Number(categoryIdFromUrl) === cat.categoryId ? 'bg-gray-200 text-black font-bold' : 'text-gray-600'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </aside>

        <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Podcasts ({podcasts.length})</h2>
                <select 
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleSort(e.target.value)}
                >
                    <option value="views-desc">Most Popular</option>
                    <option value="time-desc">Newest</option>
                    <option value="time-asc">Oldest</option>
                </select>
            </div>

            {loading ? <div className="text-center py-10">Loading...</div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {podcasts.length > 0 ? podcasts.map(pod => (
                        <div key={pod.podcastId} onClick={() => navigate(`/podcast/${pod.podcastId}`)} className="cursor-pointer group flex flex-col">
                            <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all">
                                {pod.coverImage ? 
                                    <img src={pod.coverImage} alt={pod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> :
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                }
                            </div>
                            <h3 className="font-bold text-gray-900 truncate text-lg group-hover:text-blue-600 transition-colors">{pod.title}</h3>
                            <p className="text-sm text-gray-500 truncate">{pod.creator?.userName || "Unknown Creator"}</p>
                        </div>
                    )) : <div className="col-span-3 text-center py-10 text-gray-500">No podcasts found.</div>}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};