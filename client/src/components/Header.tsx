"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import { buttonVariants } from "./ui/button";
import { LayoutDashboardIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGlobalHooks } from "@/hooks/globalHook";
import { logout } from "@/store/auth/authSlice";
import SearchBar from "./searchbar/SearchBar";
import { FaSpotify } from "react-icons/fa";

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { queryClient } = useGlobalHooks();
  const router = useRouter();
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const openLogoutDialog = () => setIsLogoutDialogOpen(true);
  const closeLogoutDialog = () => setIsLogoutDialogOpen(false);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/log-in");
    queryClient.removeQueries();
    closeLogoutDialog();
  };

  return (
    <>
      {pathname === "/log-in" ||
      pathname === "/sign-up" ||
      location.pathname === "/send-mail" ||
      pathname === "/verify-otp" ||
      pathname === "/forgot-password-mail" ||
      pathname === "/payment-success" ||
      pathname === "/payment-failure" ||
      pathname.startsWith("/forgot-password") ? null : (
        <div
          className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10
    "
        >
          <Link href={"/"}>
            <div className="flex gap-2 items-center">
              <img src="/spotify.png" className="size-8" alt="Spotify logo" />
              <h6 className="text-2xl font-bold">
                Spotify{" "}
                <span className="text-xs">{user?.subscriptionStatus}</span>
              </h6>
            </div>
          </Link>

          <SearchBar />

          <div className="flex items-center gap-4">
            <Link
              href="/subscription-plan"
              className={cn(
                buttonVariants({
                  className:
                    "hover:bg-white bg-[transparent] text-white hover:text-black border-1 border-zinc-400 hover:border-zinc-400",
                })
              )}
            >
              <FaSpotify className="size-4  mr-2" />
              Get Subcription
            </Link>
            {user?.role === "artist" && (
              <Link
                href="/artist"
                className={cn(
                  buttonVariants({
                    className:
                      "hover:bg-white bg-[transparent] text-white hover:text-black border-1 border-zinc-400 hover:border-zinc-400",
                  })
                )}
              >
                <LayoutDashboardIcon className="size-4  mr-2" />
                Dashboard
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full cursor-pointer">
                <Avatar>
                  <AvatarImage
                    src={
                      user?.profilePicture?.url ||
                      user?.gooleavatar ||
                      user?.faceBookavatar ||
                      ""
                    }
                    className="object-cover"
                  />
                  <AvatarFallback>{user?.fullName.slice(0, 1)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white m-4 text-black">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="h-4 w-4" /> Profile
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={openLogoutDialog}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="bg-[#18181b]">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeLogoutDialog}
              className="cursor-pointer text-black hover:bg-white hover:text-black"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="cursor-pointer"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
