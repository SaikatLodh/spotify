import React from "react";

const PlaylistSkeleton = () => {
  return Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="p-2 rounded-md flex items-center gap-3">
      <div className="w-12 h-12 bg-zinc-800 rounded-md flex-shrink-0 animate-pulse" />
    </div>
  ));
};

export default PlaylistSkeleton;
