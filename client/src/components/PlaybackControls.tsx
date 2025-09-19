"use client";
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import {
  ArrowDownToLine,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  VolumeX,
} from "lucide-react";
import { Slider } from "./ui/slider";
import { usePathname } from "next/navigation";
import {
  nextSong,
  previousSong,
  setCurrentTime,
  setDuration,
  setVolume,
  toggleMute,
  togglePlayPause,
  setRepeatMode,
  toggleShuffle,
} from "@/store/player/playerSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useDownloadSong } from "@/hooks/react-query/react-hooks/song/songHook";

const PlaybackControls = () => {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { mutate } = useDownloadSong();
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
  } = useSelector((state: RootState) => state.player);
  const { user } = useSelector((state: RootState) => state.auth);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    dispatch(setCurrentTime(audioRef.current.currentTime));
  };

  const onLoadedMetadata = () => {
    if (!audioRef.current) return;
    dispatch(setDuration(audioRef.current.duration));
  };

  const onSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const seekTime = value[0];
    audioRef.current.currentTime = seekTime;
    dispatch(setCurrentTime(seekTime));
  };

  const onVolumeChange = (value: number[]) => {
    dispatch(setVolume(value[0]));
  };

  const togglePlay = () => {
    dispatch(togglePlayPause());
  };

  const skipNext = () => {
    dispatch(nextSong());
  };

  const skipPrevious = () => {
    dispatch(previousSong());
  };

  const toggleShuffleMode = () => {
    dispatch(toggleShuffle());
  };

  const toggleRepeat = () => {
    dispatch(setRepeatMode());
  };

  const onEnded = () => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      dispatch(nextSong());
    }
  };

  const toggleMuteVolume = () => {
    dispatch(toggleMute());
  };

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (
    pathname === "/log-in" ||
    pathname === "/send-mail" ||
    location.pathname === "/send-mail" ||
    pathname === "/verify-otp" ||
    pathname === "/forgot-password-mail" ||
    pathname === "/payment-success" ||
    pathname === "/payment-failure" ||
    pathname.startsWith("/forgot-password")
  )
    return null;

  return (
    <>
      <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
        <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
          {/* currently playing song */}
          <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
            <img
              src={currentSong?.imageUrl?.url}
              alt={currentSong?.title}
              className="w-14 h-14 object-cover rounded-md"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate hover:underline cursor-pointer">
                {currentSong?.title}
              </div>
              <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                {currentSong?.artist?.fullName}
              </div>
            </div>
          </div>

          {/* player controls*/}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
            <div className="flex items-center gap-4 sm:gap-6">
              <Button
                size="icon"
                variant="ghost"
                className={`hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer ${
                  isShuffled ? "text-[#00A63E]" : ""
                }`}
                onClick={toggleShuffleMode}
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="hover:text-white text-zinc-400 cursor-pointer"
                onClick={skipPrevious}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                className="bg-white hover:bg-white/80 text-black rounded-full h-8 w-8 cursor-pointer"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:text-white text-zinc-400 cursor-pointer"
                onClick={skipNext}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={`hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer ${
                  repeatMode === "all"
                    ? "text-white"
                    : repeatMode === "one"
                    ? "text-[#00A63E]"
                    : ""
                }`}
                onClick={toggleRepeat}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            <div className="hidden sm:flex items-center gap-2 w-full">
              <div className="text-xs text-zinc-400">
                {formatTime(currentTime)}
              </div>
              <Slider
                step={1}
                max={duration}
                value={[currentTime]}
                onValueChange={onSeek}
                className="w-full hover:cursor-grab active:cursor-grabbing"
              />
              <div className="text-xs text-zinc-400">
                {formatTime(duration)}
              </div>
            </div>
          </div>
          {/* volume controls */}
          <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
            <div className="flex items-center gap-2">
              {user?.subscriptionStatus === "Premium" && (
                <div
                  onClick={() =>
                    mutate(currentSong?.audioUrl.publicId as string)
                  }
                >
                  <ArrowDownToLine className="h-5 w-5 cursor-pointer" />
                </div>
              )}

              <Button
                size="icon"
                variant="ghost"
                className="hover:text-white text-zinc-400 cursor-pointer"
                onClick={toggleMuteVolume}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume1 className="h-4 w-4" />
                )}
              </Button>

              <Slider
                max={100}
                step={1}
                value={[isMuted ? 0 : volume]}
                onValueChange={onVolumeChange}
                className="w-24 hover:cursor-grab active:cursor-grabbing bg-zinc-700"
              />
            </div>
          </div>
        </div>
        <audio
          ref={audioRef}
          src={currentSong?.audioUrl?.url}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
        />
      </footer>
    </>
  );
};

export default PlaybackControls;
