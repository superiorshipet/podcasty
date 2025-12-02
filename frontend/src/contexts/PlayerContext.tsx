import React, { createContext, useContext, useState, ReactNode, useRef } from "react";
import { Episode, Podcast } from "../types";

interface PlayerContextType {
  currentTrack: Episode | null;
  currentPodcast: Podcast | null;
  isPlaying: boolean;
  playTrack: (track: Episode, podcast: Podcast) => void;
  togglePlayPause: () => void;
  clearPlayer: () => void; 
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Episode | null>(null);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  

  const playTrack = (track: Episode, podcast: Podcast) => {
    setCurrentTrack(track);
    setCurrentPodcast(podcast);
    setIsPlaying(true);
    console.log("Playing:", track.title);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const clearPlayer = () => {
    setCurrentTrack(null);
    setCurrentPodcast(null);
    setIsPlaying(false);
    console.log("Player Cleared");
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        currentPodcast,
        isPlaying,
        playTrack,
        togglePlayPause,
        clearPlayer, 
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};