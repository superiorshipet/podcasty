import React from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { useAuth } from "../contexts/AuthContext";

export const GlobalPlayer = (): JSX.Element | null => {
  const { currentTrack, currentPodcast, isPlaying, togglePlayPause } = usePlayer();
  const { user } = useAuth();

  // Don't show player if no track is selected or user not logged in
  if (!currentTrack || !user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50 border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 flex-1">
            <img 
                src={currentPodcast?.coverImage || "https://placehold.co/50"} 
                alt="Cover" 
                className="w-12 h-12 rounded object-cover bg-gray-700"
            />
            <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{currentTrack.title}</p>
                <p className="text-xs text-gray-400 truncate">{currentPodcast?.title || "Unknown Podcast"}</p>
            </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center flex-1">
            <div className="flex gap-4 mb-2">
                <button 
                    onClick={togglePlayPause}
                    className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                >
                    {isPlaying ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                    ) : (
                        <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </button>
            </div>
            {/* Progress Bar (Visual Only for now) */}
            <div className="w-full bg-gray-700 rounded-full h-1 max-w-md">
                <div className="bg-white h-1 rounded-full w-0"></div>
            </div>
        </div>

        {/* Volume / Extras */}
        <div className="flex-1 flex justify-end">
             {/* Add Volume control here later */}
             <div className="text-xs text-gray-500">
                {currentTrack.duration ? `${Math.floor(currentTrack.duration / 60)}:${(currentTrack.duration % 60).toString().padStart(2, '0')}` : "00:00"}
             </div>
        </div>
      </div>
      
      {/* Hidden Audio Element for actual playback */}
      {currentTrack.audioFile && isPlaying && (
          <audio 
            src={currentTrack.audioFile} 
            autoPlay={isPlaying} 
            onEnded={() => togglePlayPause()}
          />
      )}
    </div>
  );
};