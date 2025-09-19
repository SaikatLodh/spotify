import React from "react";
import { Button } from "../ui/button";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Album } from "@/types";
import { Disc3 } from "lucide-react";
import Link from "next/link";

const SectionGrid = ({
  title,
  isLoading,
  data,
}: {
  title: string;
  isLoading?: boolean;
  data?: Album[];
}) => {
  if (isLoading) return <SectionGridSkeleton />;
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          <Link href={"/album"}>
            {" "}
            <Button className="text-sm text-white hover:text-white cursor-pointer bg-[#121214] hover:bg-[#313136]">
              Show all
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data && data.length > 0 ? (
            data.map((album) => (
              <Link href={`/album/${album.slug}`} key={album._id}>
                <div
                  key={album._id}
                  className="bg-zinc-900 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
                >
                  <div className="relative mb-4">
                    <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                      <img
                        src={album.imageUrl.url}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-300 
									group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <h3 className="font-medium mb-2 truncate">{album.title}</h3>
                  <p className="text-sm text-zinc-400 truncate">
                    {album.artistName}
                  </p>
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
      </div>
    </>
  );
};

export default SectionGrid;
