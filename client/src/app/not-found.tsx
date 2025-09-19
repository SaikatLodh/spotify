"use client";

import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link"; // Assuming you are using Next.js for routing

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] bg-[#0A0A0A] text-slate-50 text-center px-4">
      <div className="max-w-xl">
        <h1 className="text-9xl font-extrabold text-[#4CAF50] mb-4 animate-pulse">
          404
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Page Not Found
        </h2>
        <p className="text-lg md:text-xl text-slate-400 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link href="/">
          <Button className="bg-[#4CAF50] hover:bg-[#4CAF50] text-white font-semibold py-3 px-6 rounded-full transition-colors cursor-pointer">
            <MoveLeft className="mr-2 h-4 w-4" />
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
