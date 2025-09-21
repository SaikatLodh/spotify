import React from "react";
import { GalleryHorizontalEnd, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import AddPlaylistDialog from "./playlist/AddPlaylistDialog";
import { useGetPlaylist } from "@/hooks/react-query/react-hooks/playlist/playListHook";
import PlaylistSkeleton from "./PlaylistSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
const LeftSidebar = ({
  resize,
  setResize,
  isMobile,
}: {
  resize: boolean;
  setResize: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
}) => {
  const [addPlaylistDialogOpen, setAddPlaylistDialogOpen] =
    React.useState(false);
  const { data, isLoading } = useGetPlaylist();
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <div className="h-full flex flex-col gap-2 overflow-y-scroll left-side-bar-scroll">
        {/* Navigation menu */}

        <div className="rounded-lg bg-zinc-900 p-4">
          <div className="space-y-2 flex justify-center flex-col items-center gap-2">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setResize(!resize)}
            >
              <GalleryHorizontalEnd width={30} height={30} />
              {isMobile
                ? ""
                : resize && (
                    <h5 className="text-white font-bold text-[22px]">
                      Your Library
                    </h5>
                  )}
            </div>

            {(user?.subscriptionStatus === "Premium" ||
              user?.subscriptionStatus === "Pro") && (
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Plus
                      width={30}
                      height={30}
                      className="cursor-pointer"
                      onClick={() => setAddPlaylistDialogOpen(true)}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-black font-bold">
                    <p>Add to Playlist</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            {(user?.subscriptionStatus === "Premium" ||
              user?.subscriptionStatus === "Pro" ||
              user?.subscriptionStatus === "Standard") && (
              <Link href={"/likesong"}>
                <div className="w-[50px] h-[50px] rounded-[10px] bg-gradient-to-r from-violet-600 to-indigo-600 flex justify-center items-center">
                  <FaHeart />
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Library section */}
        {(user?.subscriptionStatus === "Premium" ||
          user?.subscriptionStatus === "Pro") &&
          data &&
          data.length > 0 && (
            <div className="flex-1 rounded-lg bg-zinc-900 p-4">
              {isLoading ? (
                <PlaylistSkeleton />
              ) : (
                <div className="flex flex-wrap gap-2 items-center">
                  {data &&
                    data.length > 0 &&
                    data.map((playlist) => (
                      <>
                        <div key={playlist._id}>
                          <Link href={`/playlist/${playlist.slug}`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <img
                                  src={
                                    playlist?.imageUrl?.url || "/images (2).jpg"
                                  }
                                  alt=""
                                  className="w-[50px] h-[50px] rounded-[10px] object-cover"
                                />
                              </TooltipTrigger>
                              <TooltipContent className="bg-white text-black font-bold">
                                <p>{playlist.title}</p>
                              </TooltipContent>
                            </Tooltip>
                          </Link>
                        </div>
                      </>
                    ))}
                </div>
              )}
            </div>
          )}
      </div>
      <AddPlaylistDialog
        trigger={null}
        onSuccess={() => setAddPlaylistDialogOpen(false)}
        open={addPlaylistDialogOpen}
        onOpenChange={setAddPlaylistDialogOpen}
      />
    </>
  );
};

export default LeftSidebar;
