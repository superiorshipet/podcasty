import React, { createContext, useContext, useState, ReactNode } from "react";
import { Episode, Podcast } from "../types";

interface PlayerContextType {
  currentTrack: Episode | null;
  podcastInfo: Podcast | null;
  isPlaying: boolean;
  playTrack: (track: Episode, podcast: Podcast) => void;
  pauseTrack: () => void;
  //  next, prev, seek
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Episode | null>(null);
  const [podcastInfo, setPodcastInfo] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (track: Episode, podcast: Podcast) => {
    console.log("Playing track:", track.title);
    setCurrentTrack(track);
    setPodcastInfo(podcast);
    setIsPlaying(true);
    // (e.g., new Audio(track.audioUrl).play())
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, podcastInfo, isPlaying, playTrack, pauseTrack }}>
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