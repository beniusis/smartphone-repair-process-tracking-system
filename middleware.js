import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.url;
  const token = await getToken({ req });

  if (url.includes("/auth/signin") && !token) {
    return NextResponse.next();
  }

  if (url.includes("/register") && !token) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", url));
  }

  if (url.includes("/auth/signin") && token) {
    return NextResponse.redirect(new URL("/", url));
  }

  if (url.includes("/repairs") && token) {
    return NextResponse.next();
  }

  if (url.includes("/register") && token) {
    return NextResponse.redirect(new URL("/", url));
  }

  if (url.includes("/users") && token?.role !== "administrator") {
    return NextResponse.redirect(new URL("/", url));
  }

  if (url.includes("/business-hours") && token?.role !== "administrator") {
    return NextResponse.redirect(new URL("/", url));
  }

  if (url.includes("/reservation") && token?.role !== "client") {
    return NextResponse.redirect(new URL("/", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/signin",
    "/register",
    "/repairs",
    "/repair/:path",
    "/users",
    "/reservation",
    "/profile",
    "/business-hours",
  ],
};
