"use client";
import React from "react";
import DashboardStats from "./DashboardStats";
import { ScrollArea } from "../ui/scroll-area";
import AlbumContent from "./album/AlbumContent";

const Wrapper = () => {
  return (
    <>
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div
          className="bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8"
        >
          <DashboardStats />

          <div>
            <div>
              <AlbumContent />
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
};

export default Wrapper;
