import React, { useRef, useEffect } from "react";
import { usePlayer } from "../contexts/PlayerContext";

// --- SVG Icons  ---
const PlayIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.3 4.31A1.2 1.2 0 0 0 4.5 5.5v9a1.2 1.2 0 0 0 1.8 1.09l7.2-4.5a1.2 1.2 0 0 0 0-2.18l-7.2-4.5Z" />
  </svg>
);
const PauseIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 4.5A1.5 1.5 0 0 0 4 6v8a1.5 1.5 0 0 0 1.5 1.5h1A1.5 1.5 0 0 0 8 14V6a1.5 1.5 0 0 0-1.5-1.5h-1ZM12.5 4.5A1.5 1.5 0 0 0 11 6v8a1.5 1.5 0 0 0 1.5 1.5h1A1.5 1.5 0 0 0 16 14V6a1.5 1.5 0 0 0-1.5-1.5h-1Z" />
  </svg>
);
// --- End SVG Icons ---

export const GlobalPlayer = () => {
  const { currentTrack, podcastInfo, isPlaying, playTrack, pauseTrack } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null); 

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      if (isPlaying) {
        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  if (!currentTrack || !podcastInfo) {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex items-center px-4 z-20">
      <audio ref={audioRef} />
      <div className="flex items-center gap-3 w-1/4">
        <img
          src={podcastInfo.imageUrl || "https://placehold.co/48x48/222222/ffffff?text=Ep"}
          alt={podcastInfo.title}
          className="w-12 h-12 rounded"
        />
        <div>
          <h4 className="text-sm font-medium text-gray-900 [font-family:'Arimo-Regular',Helvetica]">
            {currentTrack.title}
          </h4>
          <p className="text-xs text-gray-500 [font-family:'Arimo-Regular',Helvetica]">
            {podcastInfo.author}
          </p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex-1 flex flex-col items-center gap-2 w-1/2">
        <div className="flex items-center gap-4">
          <button className="all-[unset] box-border text-gray-700">
            {/* <PrevIcon className="w-6 h-6" /> */}
          </button>
          <button 
            onClick={() => isPlaying ? pauseTrack() : playTrack(currentTrack, podcastInfo)}
            className="all-[unset] box-border w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white"
          >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>
          <button className="all-[unset] box-border text-gray-700">
            {/* <NextIcon className="w-6 h-6" /> */}
          </button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-gray-500 [font-family:'Arimo-Regular',Helvetica]">0:00</span>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="0"
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-500 [font-family:'Arimo-Regular',Helvetica]">
            {currentTrack.duration}
          </span>
        </div>
      </div>
      
      <div className="w-1/4">
        {/* Volume controls etc. */}
      </div>
    </footer>
  );
};