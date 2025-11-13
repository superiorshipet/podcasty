import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Podcast } from "../../types";

// --- Reusable Form Components ---
const InputField = ({ label, id, ...props }: any) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-neutral-950 [font-family:'Arimo',Helvetica] mb-1">
      {label}
    </label>
    <input
      id={id}
      className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-sm"
      {...props}
    />
  </div>
);

const TextAreaField = ({ label, id, ...props }: any) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-neutral-950 [font-family:'Arimo',Helvetica] mb-1">
      {label}
    </label>
    <textarea
      id={id}
      rows={4}
      className="px-3 py-2 relative self-stretch w-full bg-[#f3f3f5] rounded-lg border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-sm"
      {...props}
    />
  </div>
);
// --- End Reusable Form Components ---


export const CreatorDashboard = (): JSX.Element => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my-podcasts' | 'upload'>('my-podcasts');

  // --- State for "My Podcasts" Tab ---
  const [myPodcasts, setMyPodcasts] = useState<Podcast[]>([]);
  const [isLoadingPodcasts, setIsLoadingPodcasts] = useState(true);

  // --- State for "Upload Center" Tab ---
  const [uploadTab, setUploadTab] = useState<'new' | 'episode'>('new');
  const [podcastName, setPodcastName] = useState("");
  const [podcastDesc, setPodcastDesc] = useState("");
  const [podcastImage, setPodcastImage] = useState<File | null>(null);
  
  const [selectedPodcastId, setSelectedPodcastId] = useState<string>("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeFile, setEpisodeFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the user's existing podcasts (for both tabs)
  useEffect(() => {
    const fetchMyPodcasts = async () => {
      setIsLoadingPodcasts(true);
      // const data = await fetch(`/api/users/${user?.id}/podcasts`);
      // const podcasts = await data.json();

      // Mock Data
      await new Promise(res => setTimeout(res, 1000));
      const mockPodcasts: Podcast[] = [
        { id: "p1", title: "My First Tech Podcast", author: user?.username || "me", imageUrl: "https://placehold.co/100x100/222/FFF?text=Tech", description: "All about tech." },
        { id: "p2", title: "Business Weekly", author: user?.username || "me", imageUrl: "https://placehold.co/100x100/444/FFF?text=Biz", description: "Business insights." },
      ];
      // To test the "empty" state, uncomment this line:
      // const mockPodcasts: Podcast[] = []; 

      setMyPodcasts(mockPodcasts);
      if (mockPodcasts.length > 0) {
        setSelectedPodcastId(mockPodcasts[0].id);
      }
      setIsLoadingPodcasts(false);
    };
    fetchMyPodcasts();
  }, [user]);

  // Form Handlers (all in English)
  const handleCreatePodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podcastName || !podcastDesc || !podcastImage) {
      setError("Please fill in all fields for the new podcast.");
      return;
    }
    setIsUploading(true);
    setError(null);
    console.log("Creating new podcast:", { podcastName, podcastDesc, podcastImage });

    await new Promise(res => setTimeout(res, 1500)); // API simulation
    // const newPodcast = await api.createPodcast({ ... });
    
    setIsUploading(false);
    // navigate(`/podcast/${newPodcast.id}`); // Navigate to new podcast
  };

  const handleUploadEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!episodeTitle || !episodeFile || !selectedPodcastId) {
      setError("Please select a podcast and provide all episode details.");
      return;
    }
    setIsUploading(true);
    setError(null);
    console.log("Uploading new episode:", { episodeTitle, episodeFile, selectedPodcastId });

    await new Promise(res => setTimeout(res, 1500)); // API simulation
    // await api.uploadEpisode(selectedPodcastId, { ... });
    
    setIsUploading(false);
    // navigate(`/podcast/${selectedPodcastId}`); // Navigate to podcast
  };

  return (
    <main className="flex flex-col w-full max-w-6xl mx-auto items-start gap-8 pt-8 pb-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 [font-family:'Arimo-Regular',Helvetica]">
        Creator Dashboard
      </h1>

      {/* --- (Part 1) Main Tabs --- */}
      <div className="flex w-full border-b border-gray-200">
        <button
          onClick={() => setActiveTab('my-podcasts')}
          className={`py-2 px-4 text-base [font-family:'Arimo',Helvetica] ${activeTab === 'my-podcasts' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500'}`}
        >
          My Podcasts
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`py-2 px-4 text-base [font-family:'Arimo',Helvetica] ${activeTab === 'upload' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500'}`}
        >
          Upload Center
        </button>
      </div>

      {/* --- (Part 2) Content based on Main Tab --- */}

      {/* --- My Podcasts Tab Content --- */}
      {activeTab === 'my-podcasts' && (
        <div className="w-full p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium text-gray-900 [font-family:'Arimo-Regular',Helvetica] mb-4">
            My Podcasts
          </h2>
          {isLoadingPodcasts ? (
            <p className="[font-family:'Arimo',Helvetica] text-gray-600">Loading your podcasts...</p>
          ) : myPodcasts.length === 0 ? (
            <div>
              <p className="[font-family:'Arimo',Helvetica] text-gray-600 mb-4">
                You haven't created any podcasts yet.
              </p>
              <button
                onClick={() => setActiveTab('upload')}
                className="all-[unset] box-border flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-pointer"
              >
                Create one now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myPodcasts.map(podcast => (
                <div key={podcast.id} className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <img src={podcast.imageUrl} alt={podcast.title} className="w-16 h-16 rounded-md object-cover mr-4" />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 [font-family:'Arimo-Regular',Helvetica]">{podcast.title}</h3>
                    <p className="text-sm text-gray-500 [font-family:'Arimo',Helvetica] truncate">{podcast.description}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/podcast/${podcast.id}`)}
                    className="all-[unset] box-border flex items-center justify-center px-3 py-1 bg-white text-gray-900 border border-gray-200 rounded-lg cursor-pointer text-sm [font-family:'Arimo-Regular',Helvetica] ml-4 transition-colors hover:bg-gray-50"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- Upload Center Tab Content --- */}
      {activeTab === 'upload' && (
        <div className="w-full">
          {/* Internal Tabs for Upload */}
          <div className="flex w-auto items-center justify-start gap-2 p-1 bg-[#ececf0] rounded-lg mb-6">
            <button
              onClick={() => setUploadTab('new')}
              className={`all-[unset] box-border h-auto items-center justify-center gap-1.5 px-4 py-1.5 flex relative cursor-pointer rounded-md ${uploadTab === 'new' ? "bg-white shadow-sm" : ""} transition-all duration-200 ease-in-out`}
            >
              <span className="relative w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-sm">Create New Podcast</span>
            </button>
            <button
              onClick={() => setUploadTab('episode')}
              className={`all-[unset] box-border h-auto items-center justify-center gap-1.5 px-4 py-1.5 flex relative cursor-pointer rounded-md ${uploadTab === 'episode' ? "bg-white shadow-sm" : ""} transition-all duration-200 ease-in-out`}
            >
              <span className="relative w-fit [font-family:'Arimo-Regular',Helvetica] font-normal text-neutral-950 text-sm">Upload New Episode</span>
            </button>
          </div>
          
          {error && <div className="text-red-500 text-sm [font-family:'Arimo',Helvetica] mb-4">{error}</div>}

          {/* Create New Podcast Form */}
          {uploadTab === 'new' && (
            <div className="w-full p-6 border border-gray-200 rounded-lg shadow-sm">
              <form onSubmit={handleCreatePodcast} className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 [font-family:'Arimo-Regular',Helvetica]">
                  New Podcast Details
                </h2>
                <InputField label="Podcast Name" id="podcastName" type="text" value={podcastName} onChange={(e:any) => setPodcastName(e.target.value)} placeholder="e.g., Tech Talks Weekly" required />
                <TextAreaField label="Description" id="podcastDesc" value={podcastDesc} onChange={(e:any) => setPodcastDesc(e.target.value)} placeholder="What is your podcast about?" required />
                <div className="w-full">
                  <label htmlFor="podcastImage" className="block text-sm font-medium text-neutral-950 [font-family:'Arimo',Helvetica] mb-1">
                    Podcast Cover Art
                  </label>
                  <input id="podcastImage" type="file" accept="image/png, image/jpeg" onChange={(e:any) => setPodcastImage(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#f3f3f5] file:text-neutral-950 hover:file:bg-gray-200 cursor-pointer" required />
                </div>
                <button type="submit" disabled={isUploading} className="all-[unset] box-border flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-pointer disabled:opacity-50">
                  {isUploading ? "Creating..." : "Create Podcast"}
                </button>
              </form>
            </div>
          )}

          {/* Upload New Episode Form */}
          {uploadTab === 'episode' && (
            <div className="w-full p-6 border border-gray-200 rounded-lg shadow-sm">
              {isLoadingPodcasts ? (
                 <p className="[font-family:'Arimo',Helvetica] text-gray-600">Loading your podcasts...</p>
              ) : myPodcasts.length === 0 ? (
                <div>
                  <p className="[font-family:'Arimo',Helvetica] text-gray-600 mb-4">
                    You must create a podcast before you can upload an episode.
                  </p>
                  <button
                    onClick={() => setUploadTab('new')}
                    className="all-[unset] box-border flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-pointer"
                  >
                    Go to Create Podcast
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUploadEpisode} className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900 [font-family:'Arimo-Regular',Helvetica]">
                    New Episode Details
                  </h2>
                  <div className="w-full">
                    <label htmlFor="selectedPodcast" className="block text-sm font-medium text-neutral-950 [font-family:'Arimo',Helvetica] mb-1">
                      Choose Podcast
                    </label>
                    <select id="selectedPodcast" value={selectedPodcastId} onChange={(e) => setSelectedPodcastId(e.target.value)} className="h-9 px-3 py-1 relative self-stretch w-full bg-[#f3f3f5] rounded-lg border-[0.8px] border-solid border-transparent [font-family:'Arimo',Helvetica] font-normal text-sm">
                      {myPodcasts.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <InputField label="Episode Title" id="episodeTitle" type="text" value={episodeTitle} onChange={(e:any) => setEpisodeTitle(e.target.value)} placeholder="e.g., The Future of AI" required />
                  <div className="w-full">
                    <label htmlFor="episodeFile" className="block text-sm font-medium text-neutral-950 [font-family:'Arimo',Helvetica] mb-1">
                      Episode Audio File
                    </label>
                    <input id="episodeFile" type="file" accept="audio/mp3, audio/mpeg" onChange={(e:any) => setEpisodeFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#f3f3f5] file:text-neutral-950 hover:file:bg-gray-200 cursor-pointer" required />
                  </div>
                  <button type="submit" disabled={isUploading} className="all-[unset] box-border flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-pointer disabled:opacity-50">
                    {isUploading ? "Uploading..." : "Upload Episode"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
};