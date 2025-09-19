import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { middlewareShape } from "./types";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const url = request.nextUrl;

  let payloadObject: middlewareShape | null = null;

  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }
      const decodedPayload = atob(parts[1]);
      payloadObject = JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (
    token === undefined &&
    (url.pathname === "/" ||
      url.pathname === "/profile" ||
      url.pathname === "/likesong" ||
      url.pathname.startsWith("/album") ||
      url.pathname.startsWith("/artist") ||
      url.pathname.startsWith("/playlist") ||
      url.pathname === "/subscription-plan")
  ) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }

  if (
    token &&
    (payloadObject?.role === "listner" || payloadObject?.role === "artist") &&
    (url.pathname === "/log-in" ||
      url.pathname === "/sign-up" ||
      url.pathname === "/send-email" ||
      url.pathname === "/verify-otp" ||
      url.pathname === "/forgot-password-mail" ||
      url.pathname.startsWith("/forgot-password"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    token &&
    payloadObject?.role === "listner" &&
    url.pathname.startsWith("/artist")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/log-in",
    "/send-mail",
    "/verify-otp",
    "/sign-up",
    "/forgot-password-mail",
    "/forgot-password/:token",
    "/profile",
    "/likesong",
    "/playlist/:path*",
    "/album/:path*",
    "/artist/:path*",
    "/subscription-plan",
  ],
};
