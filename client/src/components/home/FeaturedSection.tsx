import React from "react";
import FeaturedGridSkeleton from "./FeaturedGridSkeleton";
import { useGetRecentAlbum } from "@/hooks/react-query/react-hooks/album/album";
import { Disc3 } from "lucide-react";
import Link from "next/link";

const FeaturedSection = () => {
  const { isLoading, data } = useGetRecentAlbum();

  if (isLoading) return <FeaturedGridSkeleton />;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {data && data.length > 0 ? (
          data.map((album) => (
            <Link href={`/album/${album.slug}`} key={album._id}>
              <div
                className="flex items-center bg-zinc-900 rounded-md overflow-hidden
         hover:bg-zinc-700/50 transition-colors group cursor-pointer relative"
              >
                <img
                  src={album.imageUrl.url}
                  alt={album.title}
                  className="w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0"
                />
                <div className="flex-1 p-4">
                  <p className="font-medium truncate">{album.title}</p>
                  <p className="text-sm text-zinc-400 truncate">
                    {album.artistName}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-8 rounded-md bg-zinc-800/50">
            <Disc3 />
            <p className=" mt-2 font-bold">No albums found.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FeaturedSection;
