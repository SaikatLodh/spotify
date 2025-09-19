"use client";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import FeaturedSection from "./FeaturedSection";
import SectionGrid from "./SectionGrid";
import {
  useGetMadeForYouAlbum,
  useGettrendingAlbum,
} from "@/hooks/react-query/react-hooks/album/album";

const HomePage = () => {
  const { isLoading, data } = useGettrendingAlbum();
  const { isLoading: isLoadingTwo, data: dataTwo } = useGetMadeForYouAlbum();
  return (
    <>
      <main className="rounded-md h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">
              Good{" "}
              {new Date().getHours() < 12
                ? "Morning"
                : new Date().getHours() < 18
                ? "Afternoon"
                : new Date().getHours() < 22
                ? "Evening"
                : "Night"}
            </h1>
            <FeaturedSection />

            <div className="space-y-8">
              <SectionGrid
                title="Made For You"
                isLoading={isLoadingTwo}
                data={dataTwo}
              />
              <SectionGrid title="Trending" isLoading={isLoading} data={data} />
            </div>
          </div>
        </ScrollArea>
      </main>
    </>
  );
};

export default HomePage;
