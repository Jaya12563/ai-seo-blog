import { NextResponse } from "next/server";
import { signOut } from "@/lib/auth";

export async function POST() {
  try {
    await signOut({ redirect: false });
  } catch {}

  const response = NextResponse.redirect(
    new URL("/", process.env.NEXTAUTH_URL || "http://localhost:3000")
  );

  // Manually clear all auth cookies
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");
  response.cookies.delete("next-auth.csrf-token");
  response.cookies.delete("__Host-next-auth.csrf-token");
  response.cookies.delete("next-auth.callback-url");

  return response;
}