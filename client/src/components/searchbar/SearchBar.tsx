import { Input } from "@/components/ui/input";
import { useGetSongBySearch } from "@/hooks/react-query/react-hooks/song/songHook";
import {
  setCurrentIndex,
  setCurrentSong,
  setPlaylist,
} from "@/store/player/playerSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Song } from "@/types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import SearchSkeleton from "../SearchSkeleton";
import { AudioLines } from "lucide-react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [value] = useDebounce(search, 1000);
  const { data, isLoading } = useGetSongBySearch(value);
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong } = useSelector((state: RootState) => state.player);
  const playSong = (song: Song) => {
    // If we have album data, play from the album context
    if (data && data.length > 0) {
      const albumSongs: Song[] = data.map((song) => song);
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
    <>
      <div className="flex items-center  md:max-w-sm w-[50%] space-x-2 rounded-lg border border-gray-300 bg-[#121214]  px-3.5 py-2 relative">
        <SearchIcon className="h-4 w-4 text-white cursor-pointer" />
        <Input
          type="search"
          placeholder="What do you want to play?"
          className="w-full border-0 h-8 font-semibold text-white bg-transparent placeholder:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div
          className={`absolute top-15 left-0 pointer-events-auto bg-[#18181b] h-70 overflow-y-auto z-[10000] w-full border border-gray-300 rounded-lg left-side-bar-scroll ${
            value && value?.length > 0 ? "block" : "hidden"
          }`}
        >
          {isLoading && (
            <div className="text-white text-center ">
              <SearchSkeleton />
            </div>
          )}
          {data && data?.length > 0 ? (
            data?.map((song) => (
              <div
                key={song._id}
                className={`flex items-center p-2 cursor-pointer  ${
                  currentSong?._id === song._id
                    ? "bg-green-600 text-white"
                    : "text-zinc-400 hover:bg-white/5"
                }`}
                onClick={() => playSong(song)}
              >
                <img
                  src={song.imageUrl.url || "/a2333417170_10.jpg"}
                  alt={song.title}
                  className="w-10 h-10 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 ml-4">
                  <p className="font-medium truncate">{song.title}</p>
                  <p
                    className={`text-sm ${
                      currentSong?._id === song._id
                        ? "text-white"
                        : "text-zinc-400"
                    } truncate`}
                  >
                    {song.artist.fullName}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-8 rounded-md h-full">
              <AudioLines />
              <p className=" mt-2 font-bold">No songs found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function SearchIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
export default SearchBar;
