"use client";
import React, { useEffect, useMemo } from "react";
import { AudioLines, Clock, Heart, Pause, Play } from "lucide-react";
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
import { IoMdHeart } from "react-icons/io";
import {
  useGetLikesong,
  useLikeSong,
} from "@/hooks/react-query/react-hooks/likesong/lkesongHook";
import { FaHeart } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import SongSkeleton from "../SongSkeleton";
const LikeSong = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user?.subscriptionStatus === "Free") {
      router.push("/");
    }
  }, [user, router]);

  const { data, isLoading } = useGetLikesong();
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );

  const { mutate } = useLikeSong();
  const [search, setSearch] = React.useState("");
  const [value] = useDebounce(search, 1000);
  const playSong = (song: Song) => {
    // If we have album data, play from the album context
    if (data && data.length > 0) {
      const albumSongs: Song[] = data.map((song) => song.song);
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

  const filterSearch = useMemo(() => {
    return data?.filter((song) => {
      return song.song.title.toLowerCase().includes(value.toLowerCase());
    });
  }, [value, data]);
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
              <div className="w-[240px] h-[240px] rounded-[10px] bg-gradient-to-r from-violet-600 to-indigo-600 flex justify-center items-center">
                <FaHeart className="w-30 h-30 text-white" />
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Playlist</p>
                <h1 className="text-7xl font-bold my-4">Liked Songs</h1>
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
            <div className="px-6 pb-4 flex items-center gap-6 justify-between">
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
                  {isLoading ? (
                    <SongSkeleton />
                  ) : filterSearch && filterSearch.length > 0 ? (
                    filterSearch.map((song, index) => {
                      const isLiked = song.song.liked.some(
                        (s) => s === user?._id
                      );
                      return (
                        <div
                          key={index}
                          className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm
                      ${
                        currentSong?._id === song.song._id
                          ? "bg-green-600 text-white"
                          : "text-zinc-400 hover:bg-white/5"
                      } rounded-md group cursor-pointer
                      `}
                          onClick={() => playSong(song.song)}
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
                                    playSong(song.song);
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
                                (song && song.song?.imageUrl?.url) ||
                                "/a2333417170_10.jpg"
                              }
                              alt={song && song.song?.title}
                              className="size-10"
                            />

                            <div>
                              <div className={`font-medium text-white`}>
                                {song && song?.song.title}
                              </div>
                              <div>{song && song?.song.artist?.fullName}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {song && song?.createdAt?.split("T")[0]}
                          </div>
                          <div className="flex items-center gap-2">
                            {isLiked ? (
                              <IoMdHeart
                                className="h-5 w-5 cursor-pointer text-[red]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  mutate(song.song._id as string);
                                }}
                              />
                            ) : (
                              <Heart
                                className="h-5 w-5 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  mutate(song.song._id as string);
                                }}
                              />
                            )}
                            {formatDuration(song && song?.song.duration)}
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
    </>
  );
};

export default LikeSong;
