import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { Podcast, Category } from "../../types";

const convertBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = (error) => reject(error);
  });
};

export const CreatorDashboard = (): JSX.Element => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload-podcast' | 'upload-episode'>('upload-podcast');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [myPodcasts, setMyPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);

  const [podTitle, setPodTitle] = useState("");
  const [podDesc, setPodDesc] = useState("");
  const [podCategory, setPodCategory] = useState<number>(0);
  const [podImage, setPodImage] = useState<File | null>(null);

  const [epPodcastId, setEpPodcastId] = useState<number>(0);
  const [epTitle, setEpTitle] = useState("");
  const [epDesc, setEpDesc] = useState("");
  const [epFile, setEpFile] = useState<File | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const cats = await api.categories.getAll();
      setCategories(cats);
      
      const allPods = await api.podcasts.getAll();
      const myPods = allPods.filter((p: Podcast) => p.creatorId === user?.id); 
      setMyPodcasts(myPods);
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  const handleCreatePodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podImage || !podCategory) return alert("Image and Category required");
    setLoading(true);

    try {
      const base64Img = await convertBase64(podImage);
      await api.podcasts.create({
        title: podTitle,
        description: podDesc,
        categoryId: podCategory,
        coverImage: base64Img,
        status: 0 
      });
      alert("Podcast created successfully!");
      setPodTitle(""); setPodDesc(""); setPodImage(null);
      loadInitialData(); 
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epFile || !epPodcastId) return alert("Audio file and Podcast required");
    setLoading(true);

    try {
      const base64Audio = await convertBase64(epFile);
      await api.episodes.create({
        podcastId: epPodcastId,
        title: epTitle,
        description: epDesc,
        audioFile: base64Audio,
        duration: 0, 
        episodeNumber: 1
      });
      alert("Episode uploaded successfully!");
      setEpTitle(""); setEpDesc(""); setEpFile(null);
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Creator Studio</h1>
      
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab('upload-podcast')}
          className={`px-6 py-3 font-medium ${activeTab === 'upload-podcast' ? 'border-b-2 border-black' : 'text-gray-500'}`}
        >
          New Podcast
        </button>
        <button 
           onClick={() => setActiveTab('upload-episode')}
           className={`px-6 py-3 font-medium ${activeTab === 'upload-episode' ? 'border-b-2 border-black' : 'text-gray-500'}`}
        >
          New Episode
        </button>
      </div>

      {activeTab === 'upload-podcast' && (
        <form onSubmit={handleCreatePodcast} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Podcast Title</label>
            <input required type="text" className="w-full p-2 border rounded" value={podTitle} onChange={e => setPodTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required rows={4} className="w-full p-2 border rounded" value={podDesc} onChange={e => setPodDesc(e.target.value)} />
          </div>
          <div>
             <label className="block text-sm font-medium mb-1">Category</label>
             <select required className="w-full p-2 border rounded" onChange={e => setPodCategory(Number(e.target.value))}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
             </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            <input required type="file" accept="image/*" className="w-full" onChange={e => setPodImage(e.target.files ? e.target.files[0] : null)} />
          </div>
          <button disabled={loading} type="submit" className="bg-black text-white px-6 py-2 rounded hover:opacity-80">
            {loading ? "Creating..." : "Create Podcast"}
          </button>
        </form>
      )}

      {activeTab === 'upload-episode' && (
        <form onSubmit={handleUploadEpisode} className="space-y-4 max-w-xl">
           <div>
             <label className="block text-sm font-medium mb-1">Select Your Podcast</label>
             <select required className="w-full p-2 border rounded" onChange={e => setEpPodcastId(Number(e.target.value))}>
                <option value="">Select Podcast</option>
                {myPodcasts.map(p => <option key={p.podcastId} value={p.podcastId}>{p.title}</option>)}
             </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Episode Title</label>
            <input required type="text" className="w-full p-2 border rounded" value={epTitle} onChange={e => setEpTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required rows={4} className="w-full p-2 border rounded" value={epDesc} onChange={e => setEpDesc(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Audio File (MP3)</label>
            <input required type="file" accept="audio/*" className="w-full" onChange={e => setEpFile(e.target.files ? e.target.files[0] : null)} />
          </div>
          <button disabled={loading} type="submit" className="bg-black text-white px-6 py-2 rounded hover:opacity-80">
            {loading ? "Uploading..." : "Upload Episode"}
          </button>
        </form>
      )}
    </div>
  );
};