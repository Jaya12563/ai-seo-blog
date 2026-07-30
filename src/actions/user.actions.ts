"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const profileImage = formData.get("profileImage") as string;

  if (!name || name.trim() === "") {
    return { error: "Name is required" };
  }

  await prisma.user.update({
    where: { id: session.user.id! },
    data: {
      name: name.trim(),
      bio: bio?.trim() || null,
      profileImage: profileImage?.trim() || null,
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!newPassword || newPassword.length < 6) {
    return { error: "New password must be at least 6 characters" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id! },
  });

  if (!user?.password) return { error: "No password set" };

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return { error: "Current password is incorrect" };

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id! },
    data: { password: hashed },
  });

  return { success: true };
}