import React from "react";

const SongSkeleton = () => {
  return Array.from({ length: 7 }).map((_, i) => (
    <div
      key={i}
      className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
    >
      <div className="flex items-center justify-center">
        <div className="h-4 w-4 bg-zinc-800 rounded animate-pulse" />
      </div>
      <div className="flex items-center gap-3">
        <div className="size-10 bg-zinc-800 rounded animate-pulse" />
        <div className="space-y-1">
          <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-zinc-800 rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="flex items-center">
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-16" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-8" />
      </div>
    </div>
  ));
};

export default SongSkeleton;
