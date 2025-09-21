"use client";
import React, { useEffect, useMemo } from "react";
import { AudioLines, Clock, Pause, Play } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { formatDuration } from "@/feature/features";
import {
  setPlaylist,
  setCurrentSong,
  setCurrentIndex,
  togglePlayPause,
} from "@/store/player/playerSlice";
import { Song } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  useAddandRemoveSong,
  useGetSinglePlaylist,
} from "@/hooks/react-query/react-hooks/playlist/playListHook";
import { useGetSongBySearch } from "@/hooks/react-query/react-hooks/song/songHook";
import { useParams, useRouter } from "next/navigation";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete, MdOutlinePlaylistAdd } from "react-icons/md";
import { useState } from "react";
import AddPlaylistDialog from "./AddPlaylistDialog";
import DeletePlaylistDialog from "./DeletePlaylistDislog";
import SearchSongsPopup from "./SearchSongsPopup";
import { Input } from "../ui/input";
import { useDebounce } from "use-debounce";
import { FaMinus } from "react-icons/fa";
import SongSkeleton from "../SongSkeleton";

interface PlaylistData {
  _id?: string;
  title?: string;
  slug: string;
  imageUrl?: { url: string };
}

const Playlist = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (
      user?.subscriptionStatus === "Free" ||
      user?.subscriptionStatus === "Standard"
    ) {
      router.push("/");
    }
  }, [user, router]);
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading: isLoadingPlaylist } = useGetSinglePlaylist(slug);
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState<PlaylistData | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [search, setSearch] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [value] = useDebounce(search, 1000);
  const [searchValue] = useDebounce(searchQuery, 1000);
  const { mutate } = useAddandRemoveSong();
  const { data: searchResults, isLoading } = useGetSongBySearch(searchValue);
  const playSong = (song: Song) => {
    // If we have album data, play from the album context
    if (data && data.length > 0) {
      const albumSongs: Song[] = data.map((song) => song.songs).flat();
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

  const openEditDialog = () => {
    if (data && data.length > 0) {
      setPlaylistToEdit(data[0]);
      setIsEditMode(true);
      setIsDialogOpen(true);
    }
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const filterSearch = useMemo(() => {
    return (
      data &&
      data[0].songs?.filter((song) => {
        return song.title.toLowerCase().includes(value.toLowerCase());
      })
    );
  }, [data, value]);

  return (
    <>
      <ScrollArea className=" rounded-md h-[calc(100vh-180px)]">
        {/* Main Content */}
        <div className="relative min-h-full">
          {/* bg gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none h-full"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <div>
                <img
                  src={(data && data[0]?.imageUrl?.url) || "/images (2).jpg"}
                  alt=""
                  className="w-[240px] h-[240px] rounded-[10px] object-cover"
                />
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Public Playlist</p>
                <h1 className="text-7xl font-bold my-4">
                  {data && data[0].title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <div className="flex gap-2 items-center">
                    <img
                      src={
                        (user && user.profilePicture?.url) ||
                        user?.faceBookavatar ||
                        user?.gooleavatar ||
                        "/istockphoto-108195157-2048x2048.jpg"
                      }
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <h6>{user && user.fullName}</h6>
                  </div>
                  {data && data.length > 0 && (
                    <span> • {data && data.length} songs</span>
                  )}
                </div>
              </div>
            </div>

            {/* play button */}
            <div className="px-6 pb-4 flex items-center justify-between gap-6 w-full">
              <div className="flex items-center gap-6">
                {isPlaying ? (
                  <Button
                    size="icon"
                    className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400
                               hover:scale-105 transition-all cursor-pointer"
                    onClick={() => dispatch(togglePlayPause())}
                    disabled={
                      filterSearch && filterSearch.length > 0 ? false : true
                    }
                  >
                    <Pause className="h-7 w-7 text-white" />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400
                               hover:scale-105 transition-all cursor-pointer"
                    onClick={() => dispatch(togglePlayPause())}
                    disabled={
                      filterSearch && filterSearch.length > 0 ? false : true
                    }
                  >
                    <Play className="h-7 w-7 text-white" />
                  </Button>
                )}
                <div>
                  <MdOutlinePlaylistAdd
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => setIsSearchDialogOpen(true)}
                  />
                </div>
                <div>
                  <AiFillEdit
                    className="h-8 w-8 cursor-pointer"
                    onClick={openEditDialog}
                  />
                </div>
                <div>
                  <MdDelete
                    className="h-8 w-8 cursor-pointer"
                    onClick={openDeleteDialog}
                  />
                </div>
              </div>
              <div>
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-white font-bold"
                  placeholder="Search in your playlist"
                />
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* songs list */}

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {isLoadingPlaylist ? (
                    <SongSkeleton />
                  ) : filterSearch && filterSearch.length > 0 ? (
                    filterSearch.map((song, index) => {
                      return (
                        <div
                          key={index}
                          className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm
                      ${
                        currentSong?._id === song._id
                          ? "bg-green-600 text-white"
                          : "text-zinc-400 hover:bg-white/5"
                      } rounded-md group cursor-pointer
                      `}
                          onClick={() => playSong(song)}
                        >
                          <div className="flex items-center justify-center">
                            {currentSong?._id === song._id ? (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-4 w-4 text-white hover:text-green-400 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(togglePlayPause());
                                }}
                              >
                                {isPlaying ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                            ) : (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playSong(song);
                                  }}
                                >
                                  <Play className="h-3 w-3" />
                                </Button>
                                <span className="group-hover:hidden">
                                  {index + 1}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <img
                              src={
                                (song && song?.imageUrl?.url) ||
                                "/a2333417170_10.jpg"
                              }
                              alt={song && song?.title}
                              className="size-10"
                            />

                            <div>
                              <div className={`font-medium text-white`}>
                                {song && song?.title}
                              </div>
                              <div>{song && song?.artist?.fullName}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {song && song?.createdAt?.split("T")[0]}
                          </div>
                          <div className="flex items-center gap-2">
                            <div>
                              <FaMinus
                                onClick={(e) => {
                                  e.stopPropagation();
                                  mutate({
                                    slug: slug,
                                    songId: song._id,
                                  });
                                }}
                              />
                            </div>
                            {formatDuration(song && song?.duration)}
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
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <SearchSongsPopup
        open={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults || []}
        isLoading={isLoading}
        playlist={data}
        mutate={mutate}
      />
      <AddPlaylistDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditMode={isEditMode}
        playlistData={playlistToEdit}
      />
      <DeletePlaylistDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        playlistSlug={slug}
        playlistTitle={data && data[0]?.title}
      />
    </>
  );
};

export default Playlist;
