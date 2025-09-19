import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song } from "@/types";

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playlist: Song[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: "off" | "one" | "all";
  isLoading: boolean;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
  isMuted: false,
  playlist: [],
  currentIndex: -1,
  isShuffled: false,
  repeatMode: "off",
  isLoading: false,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
      state.playlist = [action.payload]; // Create a playlist with the single song
      state.currentIndex = 0;
      state.isPlaying = true;
      state.currentTime = 0;
      state.duration = action.payload.duration;
    },
    setPlaylist: (state, action: PayloadAction<Song[]>) => {
      state.playlist = action.payload;
      state.currentIndex = action.payload.length > 0 ? 0 : -1;
      if (action.payload.length > 0) {
        state.currentSong = action.payload[0];
        state.isPlaying = true;
        state.currentTime = 0;
        state.duration = action.payload[0].duration;
      }
    },
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    nextSong: (state) => {
      if (state.playlist.length === 0) return;

      let nextIndex = state.currentIndex + 1;

      if (state.repeatMode === "all") {
        if (nextIndex >= state.playlist.length) {
          nextIndex = 0;
        }
      } else {
        if (nextIndex >= state.playlist.length) {
          state.isPlaying = false;
          return;
        }
      }

      state.currentIndex = nextIndex;
      state.currentSong = state.playlist[nextIndex];
      state.currentTime = 0;
      state.duration = state.playlist[nextIndex].duration;
      state.isPlaying = true;
    },
    previousSong: (state) => {
      if (state.playlist.length === 0) return;

      let prevIndex = state.currentIndex - 1;

      if (state.repeatMode === "all") {
        if (prevIndex < 0) {
          prevIndex = state.playlist.length - 1;
        }
      } else {
        if (prevIndex < 0) {
          prevIndex = 0;
        }
      }

      state.currentIndex = prevIndex;
      state.currentSong = state.playlist[prevIndex];
      state.currentTime = 0;
      state.duration = state.playlist[prevIndex].duration;
      state.isPlaying = true;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
      state.isMuted = action.payload === 0;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    toggleShuffle: (state) => {
      state.isShuffled = !state.isShuffled;
      if (state.isShuffled) {
        // Shuffle the playlist (excluding current song)
        const currentSong = state.currentSong;
        const remainingSongs = state.playlist.filter(song => song._id !== currentSong?._id);
        const shuffled = [...remainingSongs].sort(() => Math.random() - 0.5);
        state.playlist = currentSong ? [currentSong, ...shuffled] : shuffled;
        state.currentIndex = 0;
      } else {
        // Restore original order (this would need to be implemented based on your data structure)
        // For now, we'll just disable shuffle
      }
    },
    setRepeatMode: (state) => {
      if (state.repeatMode === "off") {
        state.repeatMode = "all";
      } else if (state.repeatMode === "all") {
        state.repeatMode = "one";
      } else {
        state.repeatMode = "off";
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.playlist.length) {
        state.currentIndex = action.payload;
        state.currentSong = state.playlist[action.payload];
        state.currentTime = 0;
        state.duration = state.playlist[action.payload].duration;
        state.isPlaying = true;
      }
    },
    clearPlayer: (state) => {
      state.currentSong = null;
      state.isPlaying = false;
      state.currentTime = 0;
      state.duration = 0;
      state.playlist = [];
      state.currentIndex = -1;
    },
  },
});

export const {
  setCurrentSong,
  setPlaylist,
  play,
  pause,
  togglePlayPause,
  nextSong,
  previousSong,
  setCurrentTime,
  setDuration,
  setVolume,
  toggleMute,
  toggleShuffle,
  setRepeatMode,
  setLoading,
  setCurrentIndex,
  clearPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
