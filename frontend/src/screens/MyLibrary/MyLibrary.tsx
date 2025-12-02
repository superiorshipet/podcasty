import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { PlayHistory } from "../../types";
import { useNavigate } from "react-router-dom";

export const MyLibrary = (): JSX.Element => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<PlayHistory[]>([]);
  const [following, setFollowing] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyData = await api.history.getMine();
        const interactionsData = await api.interactions.getByUser();
        
        setHistory(Array.isArray(historyData) ? historyData : []);
        setFollowing(Array.isArray(interactionsData) ? interactionsData : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Library...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Library</h1>

      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">Recently Played</h2>
        {history.length > 0 ? (
          <div className="space-y-2">
            {history.map(item => (
              <div key={item.historyId} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
                <div>
                   <h4 className="font-bold">{item.episodeTitle}</h4>
                   <p className="text-xs text-gray-500">Played on {new Date(item.lastPlayed).toLocaleDateString()}</p>
                </div>
                <button onClick={() => navigate(`/podcast/${item.episodeId}`)} className="text-sm text-blue-600">Resume</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No listening history yet.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Followed Podcasts</h2>
        {/* You would map over 'following' here filtering for InteractionType.Follow */}
        <p className="text-gray-500">Feature coming soon based on interaction data.</p>
      </div>
    </div>
  );
};