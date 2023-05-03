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

  if (url.includes("/register") && token) {
    return NextResponse.redirect(new URL("/", url));
  }

  if (url.includes("/users") && token?.role !== "administrator") {
    console.log("a");
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
    "/users",
    "/reservation",
  ],
};
