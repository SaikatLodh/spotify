import React from "react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Playlist, Song } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  setCurrentIndex,
  setCurrentSong,
  setPlaylist,
} from "@/store/player/playerSlice";
import { FaMinus, FaPlus } from "react-icons/fa";
import { AudioLines } from "lucide-react";
import SearchSkeleton from "../SearchSkeleton";

interface SearchSongsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: Song[];
  isLoading: boolean;
  playlist: Playlist[] | undefined;
  mutate: ({ slug, songId }: { slug: string; songId: string }) => void;
}

const SearchSongsPopup: React.FC<SearchSongsPopupProps> = ({
  open,
  onOpenChange,
  searchQuery,
  onSearchChange,
  searchResults,
  isLoading,
  playlist,
  mutate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong } = useSelector((state: RootState) => state.player);

  const playSong = (song: Song) => {
    // If we have album data, play from the album context
    if (searchResults && searchResults.length > 0) {
      const albumSongs: Song[] = searchResults.map((song) => song);
      const songIndex = albumSongs.findIndex((s) => s._id === song._id);
      if (songIndex !== -1) {
        dispatch(setPlaylist(albumSongs));
        // Set the current index to the clicked song
        dispatch(setCurrentIndex(songIndex));
        return;
      }
    }
    // Fallback to single song play
    dispatch(setCurrentSong(song));
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Search Songs</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
            placeholder="Search songs..."
            autoFocus
          />
          <ScrollArea className="h-[400px]">
            {isLoading && (
              <div className="text-white text-center ">
                <SearchSkeleton />
              </div>
            )}
            <div className="space-y-2">
              {searchResults && searchResults.length > 0 ? (
                searchResults.map((song) => {
                  const isSongInPlaylist = playlist?.some((playlist) =>
                    playlist.songs.some((s) => s._id === song._id)
                  );
                  return (
                    <div
                      key={song._id}
                      className={` cursor-pointer  ${
                        currentSong?._id === song._id
                          ? "bg-green-600 text-white"
                          : "text-zinc-400 hover:bg-white/5"
                      }`}
                      onClick={() => playSong(song)}
                    >
                      <div className="flex items-center justify-between p-2">
                        <div className="flex items-center  gap-3">
                          <img
                            src={song.imageUrl?.url || "/a2333417170_10.jpg"}
                            alt={song.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-semibold truncate">
                              {song.title}
                            </span>
                            <span className="text-sm truncate">
                              {song.artist?.fullName}
                            </span>
                          </div>
                        </div>
                        <div>
                          {isSongInPlaylist ? (
                            <FaMinus
                              onClick={(e) => {
                                e.stopPropagation();
                                mutate({
                                  slug: playlist![0].slug,
                                  songId: song._id,
                                });
                              }}
                            />
                          ) : (
                            <FaPlus
                              onClick={(e) => {
                                e.stopPropagation();
                                mutate({
                                  slug: playlist![0].slug,
                                  songId: song._id,
                                });
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-8 rounded-md bg-zinc-800/50">
                  <AudioLines />
                  <p className=" mt-2 font-bold">No songs found.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchSongsPopup;
