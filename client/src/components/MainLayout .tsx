"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useState } from "react";
import LeftSidebar from "./LeftSidebar";
import PlaybackControls from "./PlaybackControls";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const [resize, setResize] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full  p-2"
      >
        {pathname === "/log-in" ||
        pathname === "/send-mail" ||
        pathname === "/sign-up" ||
        pathname === "/verify-otp" ||
        pathname === "/forgot-password-mail" ||
        pathname === "/payment-success" ||
        pathname === "/payment-failure" ||
        pathname.startsWith(
          "/forgot-password"
        ) ? null : user?.subscriptionStatus !== "Free" ? (
          <ResizablePanel
            defaultSize={20}
            minSize={isMobile ? 20 : resize ? 15 : !resize ? 5 : 15}
            maxSize={isMobile ? 20 : resize ? 15 : !resize ? 5 : 15}
          >
            <LeftSidebar
              resize={resize}
              setResize={setResize}
              isMobile={isMobile}
            />
          </ResizablePanel>
        ) : null}

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        <ResizablePanel defaultSize={isMobile ? 100 : 100}>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>

      <PlaybackControls />
    </div>
  );
};
export default MainLayout;
