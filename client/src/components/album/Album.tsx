"use client";

import React, { use, useMemo } from "react";
import { AudioLines, Clock, Heart, Pause, Play } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { useGetSingleAlbum } from "@/hooks/react-query/react-hooks/album/album";
import { useParams } from "next/navigation";
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
import { useLikeSong } from "@/hooks/react-query/react-hooks/likesong/lkesongHook";
import { useDebounce } from "use-debounce";
import { Input } from "../ui/input";
import SongSkeleton from "../SongSkeleton";

const Album = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useGetSingleAlbum(slug);
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { mutate } = useLikeSong();
  const [search, setSearch] = React.useState("");
  const [value] = useDebounce(search, 1000);
  const playSong = (song: Song) => {
    // If we have album data, play from the album context
    if (data && data.length > 0) {
      const albumSongs: Song[] = data[0].songs.map((song) => song);
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
              <img
                src={
                  (data && data[0]?.imageUrl?.url) ||
                  "/istockphoto-108195157-2048x2048.jpg"
                }
                alt={data && data[0].title}
                className="w-[240px] h-[240px] shadow-xl rounded object-cover"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-7xl font-bold my-4">
                  {data && data[0].title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {data && data[0].artistName}
                  </span>
                  {data && data.length > 0 && (
                    <span> • {data && data[0].songs.length} songs</span>
                  )}
                  <span>• {data && data[0].createdAt.split("T")[0]}</span>
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
                      const isLiked = song.liked.some((id) => id === user?._id);
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
                            {(user?.subscriptionStatus === "Premium" ||
                              user?.subscriptionStatus === "Pro" ||
                              user?.subscriptionStatus === "Standard") &&
                              (isLiked ? (
                                <IoMdHeart
                                  className="h-5 w-5 cursor-pointer text-[red]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    mutate(song._id as string);
                                  }}
                                />
                              ) : (
                                <Heart
                                  className="h-5 w-5 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    mutate(song._id as string);
                                  }}
                                />
                              ))}
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
    </>
  );
};

export default Album;
