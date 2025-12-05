import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Episode, Podcast } from "../types";
import { api } from "../services/api";

interface PlayerContextType {
  currentTrack: Episode | null;
  currentPodcast: Podcast | null;
  isPlaying: boolean;
  audioUrl: string | null;
  isLoading: boolean;
  playTrack: (track: Episode, podcast: Podcast) => void;
  togglePlayPause: () => void;
  clearPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Cache for audio URLs to avoid refetching
const audioCache = new Map<number, string>();

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Episode | null>(null);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playedEpisodes, setPlayedEpisodes] = useState<Set<number>>(new Set());

  const playTrack = useCallback(async (track: Episode, podcast: Podcast) => {
    // If same track, just toggle play/pause
    if (currentTrack?.episodeId === track.episodeId) {
      setIsPlaying(!isPlaying);
      return;
    }

    setCurrentTrack(track);
    setCurrentPodcast(podcast);
    setIsLoading(true);

    try {
      // Check cache first
      if (audioCache.has(track.episodeId)) {
        setAudioUrl(audioCache.get(track.episodeId)!);
      } else if (track.audioFile) {
        // Track already has audioFile
        setAudioUrl(track.audioFile);
        audioCache.set(track.episodeId, track.audioFile);
      } else {
        // Fetch audio separately
        const audioData = await api.episodes.getAudio(track.episodeId);
        const url = audioData?.audioFile || null;
        setAudioUrl(url);
        if (url) audioCache.set(track.episodeId, url);
      }

      setIsPlaying(true);

      // Fire and forget: record play count & history (don't wait)
      if (!playedEpisodes.has(track.episodeId)) {
        api.episodes.recordPlay(track.episodeId)
          .then(() => setPlayedEpisodes(prev => new Set(prev).add(track.episodeId)))
          .catch(console.error);
      }

      api.history.add({
        episodeId: track.episodeId,
        progressSeconds: 0,
        completed: false
      }).catch(console.error);

    } catch (e) {
      console.error("Failed to load audio:", e);
    } finally {
      setIsLoading(false);
    }
  }, [currentTrack, isPlaying, playedEpisodes]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const clearPlayer = useCallback(() => {
    setCurrentTrack(null);
    setCurrentPodcast(null);
    setAudioUrl(null);
    setIsPlaying(false);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        currentPodcast,
        isPlaying,
        audioUrl,
        isLoading,
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
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
};