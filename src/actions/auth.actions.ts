"use server";

import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerUser(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
  });
  if (existing) return { error: "Email already registered" };

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return { success: true };
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return { error: "Invalid email or password" };
  }

  if (user.isSuspended) {
    return { error: "Your account has been suspended" };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: "Invalid email or password" };
  }

  const redirectTo =
    user.role === "ADMIN" ? "/admin" : "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error: any) {
    if (
      error?.message?.includes("NEXT_REDIRECT") ||
      error?.digest?.includes("NEXT_REDIRECT")
    ) {
      throw error;
    }
    return { error: "Something went wrong. Please try again." };
  }
}

export async function logoutUser() {
  // Clear all auth cookies manually before signing out
  const cookieStore = await cookies();

  const authCookies = [
    "next-auth.session-token",
    "next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.session-token",
    "__Secure-next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "__Secure-next-auth.callback-url",
  ];

  authCookies.forEach((cookieName) => {
    try {
      cookieStore.delete(cookieName);
    } catch {}
  });

  await signOut({ redirectTo: "/" });
}