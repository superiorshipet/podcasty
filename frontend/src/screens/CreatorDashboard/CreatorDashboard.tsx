import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { Podcast, Category } from "../../types";

// Convert file to Base64 with progress tracking
const convertBase64WithProgress = (
  file: File,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    fileReader.onload = () => {
      onProgress(100);
      resolve(fileReader.result as string);
    };

    fileReader.onerror = (error) => reject(error);
    fileReader.readAsDataURL(file);
  });
};

// Get audio duration from file
const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(Math.round(audio.duration));
    };
    audio.onerror = () => resolve(0);
  });
};

export const CreatorDashboard = (): JSX.Element => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload-podcast' | 'upload-episode'>('upload-podcast');

  const [categories, setCategories] = useState<Category[]>([]);
  const [myPodcasts, setMyPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<string>("");

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Podcast Form State
  const [podTitle, setPodTitle] = useState("");
  const [podDesc, setPodDesc] = useState("");
  const [podCategory, setPodCategory] = useState<number>(0);
  const [podImage, setPodImage] = useState<File | null>(null);

  // Episode Form State
  const [epPodcastId, setEpPodcastId] = useState<number>(0);
  const [epTitle, setEpTitle] = useState("");
  const [epDesc, setEpDesc] = useState("");
  const [epFile, setEpFile] = useState<File | null>(null);
  const [epCover, setEpCover] = useState<File | null>(null);
  const [epDuration, setEpDuration] = useState<number>(0);

  const loadInitialData = async () => {
    if (!user) return;
    try {
      const cats = await api.categories.getAll();
      setCategories(Array.isArray(cats) ? cats : []);
      const allPods = await api.podcasts.getAll();
      if (!Array.isArray(allPods)) {
        setMyPodcasts([]);
        return;
      }
      const myPods = allPods.filter((p: Podcast) => p.creatorId === user.id);
      setMyPodcasts(myPods);
      if (myPods.length > 0 && epPodcastId === 0) {
        setEpPodcastId(myPods[0].podcastId);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load initial data.");
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate MP3 file
      const validTypes = ['audio/mpeg', 'audio/mp3'];
      const isMP3 = validTypes.includes(file.type) || file.name.toLowerCase().endsWith('.mp3');

      if (!isMP3) {
        setError("Please upload an MP3 file only. Other audio formats are not supported.");
        e.target.value = ''; // Clear the input
        setEpFile(null);
        setEpDuration(0);
        return;
      }

      setError(null);
      setEpFile(file);
      const duration = await getAudioDuration(file);
      setEpDuration(duration);
    }
  };

  const handleCreatePodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podImage || !podCategory || !podTitle) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    setUploadStage("Processing image...");

    try {
      const base64Img = await convertBase64WithProgress(podImage, setUploadProgress);
      setUploadStage("Creating podcast...");

      await api.podcasts.create({
        title: podTitle,
        description: podDesc,
        categoryId: podCategory,
        coverImage: base64Img,
        status: 0
      });

      setSuccessMessage("Podcast created successfully! 🎉");
      setShowSuccessModal(true);
      setPodTitle(""); setPodDesc(""); setPodImage(null); setPodCategory(0);
      await loadInitialData();

      // Auto switch to episode tab after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        setActiveTab('upload-episode');
      }, 2000);
    } catch (err: any) {
      setError("Error creating podcast: " + err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
      setUploadStage("");
    }
  };

  const handleUploadEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epFile || !epPodcastId || !epTitle) {
      setError("Please fill all required episode fields.");
      return;
    }

    // Double check MP3 validation
    const validTypes = ['audio/mpeg', 'audio/mp3'];
    const isMP3 = validTypes.includes(epFile.type) || epFile.name.toLowerCase().endsWith('.mp3');
    if (!isMP3) {
      setError("Please upload an MP3 file only.");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Stage 1: Convert audio file
      setUploadStage("Converting audio file...");
      const base64Audio = await convertBase64WithProgress(epFile, (progress) => {
        // Audio conversion is 0-70% of the progress
        setUploadProgress(Math.round(progress * 0.7));
      });

      // Stage 2: Convert cover if provided
      let coverBase64 = null;
      if (epCover) {
        setUploadStage("Processing cover image...");
        coverBase64 = await convertBase64WithProgress(epCover, (progress) => {
          // Cover conversion is 70-80% of the progress
          setUploadProgress(70 + Math.round(progress * 0.1));
        });
      } else {
        setUploadProgress(80);
      }

      // Stage 3: Upload to server
      setUploadStage("Uploading to server...");
      setUploadProgress(85);

      const episodeData: any = {
        podcastId: epPodcastId,
        title: epTitle,
        description: epDesc,
        audioFile: base64Audio,
        duration: epDuration,
        episodeNumber: 1
      };

      if (coverBase64) {
        episodeData.coverImage = coverBase64;
      }

      await api.episodes.create(episodeData);
      setUploadProgress(100);

      // Show success modal
      setSuccessMessage("Episode uploaded successfully! 🎧");
      setShowSuccessModal(true);

      // Reset form
      setEpTitle(""); setEpDesc(""); setEpFile(null); setEpCover(null); setEpDuration(0);

      // Clear file inputs
      const audioInput = document.querySelector('input[type="file"][accept="audio/mpeg,.mp3"]') as HTMLInputElement;
      const coverInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
      if (audioInput) audioInput.value = '';
      if (coverInput) coverInput.value = '';

      // Auto hide success modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);

    } catch (err: any) {
      setError("Error uploading episode: " + err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
      setUploadStage("");
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl transform animate-bounce-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600 text-lg">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Upload Progress Modal */}
      {loading && uploadProgress > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Uploading...</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{uploadStage}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm">Please wait while we upload your content...</p>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">Creator Studio</h1>
      <div className="flex border-b mb-6">
        <button onClick={() => setActiveTab('upload-podcast')} className={`px-6 py-3 font-medium ${activeTab === 'upload-podcast' ? 'border-b-2 border-black' : 'text-gray-500'}`}>
          New Podcast
        </button>
        <button onClick={() => setActiveTab('upload-episode')} className={`px-6 py-3 font-medium ${activeTab === 'upload-episode' ? 'border-b-2 border-black' : 'text-gray-500'}`}>
          New Episode
        </button>
      </div>
      {error && <div className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</div>}

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
            <select required className="w-full p-2 border rounded" value={podCategory} onChange={e => setPodCategory(Number(e.target.value))}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            <input required type="file" accept="image/*" className="w-full" onChange={e => setPodImage(e.target.files ? e.target.files[0] : null)} />
          </div>
          <button disabled={loading} type="submit" className="bg-black text-white px-6 py-2 rounded hover:opacity-80 disabled:opacity-50">
            {loading ? "Creating..." : "Create Podcast"}
          </button>
        </form>
      )}

      {activeTab === 'upload-episode' && (
        <form onSubmit={handleUploadEpisode} className="space-y-4 max-w-xl">
          {myPodcasts.length === 0 && <div className="text-gray-600 border border-dashed p-3">You must create a podcast first.</div>}
          {myPodcasts.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Select Your Podcast</label>
              <select required className="w-full p-2 border rounded" value={epPodcastId} onChange={e => setEpPodcastId(Number(e.target.value))}>
                <option value="">Select Podcast</option>
                {myPodcasts.map(p => <option key={p.podcastId} value={p.podcastId}>{p.title}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Episode Title</label>
            <input required type="text" className="w-full p-2 border rounded" value={epTitle} onChange={e => setEpTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required rows={4} className="w-full p-2 border rounded" value={epDesc} onChange={e => setEpDesc(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Episode Cover Image (Optional)</label>
            <input type="file" accept="image/*" className="w-full" onChange={e => setEpCover(e.target.files ? e.target.files[0] : null)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Audio File <span className="text-purple-600 font-semibold">(MP3 only)</span>
            </label>
            <input
              required
              type="file"
              accept="audio/mpeg,.mp3"
              className="w-full"
              onChange={handleAudioFileChange}
            />
            {epFile && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span className="font-medium">{epFile.name}</span>
                </div>
                <div className="text-sm text-green-600 mt-1">
                  Size: {formatFileSize(epFile.size)} • Duration: {formatDuration(epDuration)}
                </div>
              </div>
            )}
          </div>
          <button disabled={loading || myPodcasts.length === 0} type="submit" className="bg-black text-white px-6 py-2 rounded hover:opacity-80 disabled:opacity-50 flex items-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Upload Episode"
            )}
          </button>
        </form>
      )}
    </div>
  );
};
