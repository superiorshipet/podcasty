import React, { useRef, useState, useEffect } from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { useAuth } from "../contexts/AuthContext";

export const GlobalPlayer = (): JSX.Element | null => {
    const { currentTrack, currentPodcast, isPlaying, audioUrl, isLoading, togglePlayPause, clearPlayer } = usePlayer();
    const { user } = useAuth();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        if (!isFinite(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle time update
    const handleTimeUpdate = () => {
        if (audioRef.current && !isDragging) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    // Handle metadata loaded (duration)
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // Handle seek
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = volume || 0.7;
                setIsMuted(false);
            } else {
                audioRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    };

    // Handle play/pause sync
    useEffect(() => {
        if (audioRef.current && audioUrl) {
            audioRef.current.volume = isMuted ? 0 : volume;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log('Play error:', e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, audioUrl, volume, isMuted]);

    // Handle buffering states
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handlePlaying = () => setIsBuffering(false);

    // Don't render player if no track or no user
    if (!currentTrack || !user) return null;

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Volume icon based on level
    const VolumeIcon = () => {
        if (isMuted || volume === 0) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
            );
        } else if (volume < 0.5) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
            );
        } else {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
            );
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50 border-t border-gray-800">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                {/* Track Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                        src={(currentTrack as any).coverImage || currentPodcast?.coverImage || "https://placehold.co/50"}
                        alt="Cover"
                        className="w-12 h-12 rounded object-cover bg-gray-700 flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">{currentTrack.title}</p>
                        <p className="text-xs text-gray-400 truncate">{currentPodcast?.title || "Unknown Podcast"}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center flex-1">
                    <div className="flex gap-4 mb-2">
                        {/* Skip Back 10s */}
                        <button
                            onClick={() => {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                                }
                            }}
                            className="w-8 h-8 text-gray-400 hover:text-white transition flex items-center justify-center"
                            title="Back 10 seconds"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.5 3C17.15 3 21.08 6.03 22.47 10.22L20.1 11C19.05 7.81 16.04 5.5 12.5 5.5C10.54 5.5 8.77 6.22 7.38 7.38L10 10H3V3L5.6 5.6C7.45 4 9.85 3 12.5 3M10 12H13V18H10V12Z" />
                            </svg>
                        </button>

                        {/* Play/Pause */}
                        <button
                            onClick={togglePlayPause}
                            disabled={isLoading}
                            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-50"
                        >
                            {isLoading || isBuffering ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : isPlaying ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                            ) : (
                                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </button>

                        {/* Skip Forward 10s */}
                        <button
                            onClick={() => {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
                                }
                            }}
                            className="w-8 h-8 text-gray-400 hover:text-white transition flex items-center justify-center"
                            title="Forward 10 seconds"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.5 3C6.85 3 2.92 6.03 1.53 10.22L3.9 11C4.95 7.81 7.96 5.5 11.5 5.5C13.46 5.5 15.23 6.22 16.62 7.38L14 10H21V3L18.4 5.6C16.55 4 14.15 3 11.5 3M14 12H11V18H14V12Z" />
                            </svg>
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
                        <div className="flex-1 relative">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleSeek}
                                onMouseDown={() => setIsDragging(true)}
                                onMouseUp={() => setIsDragging(false)}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                                style={{
                                    background: `linear-gradient(to right, #fff ${progress}%, #374151 ${progress}%)`
                                }}
                            />
                        </div>
                        <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume & Close */}
                <div className="flex-1 flex justify-end items-center gap-3">
                    {/* Volume Control */}
                    <div
                        className="relative flex items-center gap-2"
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                        <button
                            onClick={toggleMute}
                            className="text-gray-400 hover:text-white transition"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            <VolumeIcon />
                        </button>

                        {/* Volume Slider */}
                        <div className={`flex items-center transition-all duration-200 overflow-hidden ${showVolumeSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer volume-slider"
                                style={{
                                    background: `linear-gradient(to right, #8b5cf6 ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%)`
                                }}
                            />
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={clearPlayer}
                        className="text-gray-400 hover:text-white transition p-1 hover:bg-gray-800 rounded"
                        title="Close player"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Audio Element */}
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    preload="auto"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => togglePlayPause()}
                    onWaiting={handleWaiting}
                    onCanPlay={handleCanPlay}
                    onPlaying={handlePlaying}
                />
            )}

            <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider-thumb::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 10px;
          height: 10px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
        }
        .volume-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
        </div>
    );
};
