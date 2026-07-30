"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getAdminStats() {
  await checkAdmin();
  const [
    totalUsers,
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalCategories,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.blog.count(),
    prisma.blog.count({ where: { status: "PUBLISHED" } }),
    prisma.blog.count({ where: { status: "DRAFT" } }),
    prisma.category.count(),
  ]);
  return {
    totalUsers,
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalCategories,
  };
}

export async function getAllUsers() {
  await checkAdmin();
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isSuspended: true,
      createdAt: true,
      _count: { select: { blogs: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function suspendUser(userId: string) {
  await checkAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { isSuspended: true },
  });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function activateUser(userId: string) {
  await checkAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { isSuspended: false },
  });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  await checkAdmin();
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function getAllBlogsAdmin() {
  await checkAdmin();
  return prisma.blog.findMany({
    include: {
      author: { select: { name: true, email: true } },
      category: true,
      _count: { select: { likes: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveBlog(blogId: string) {
  await checkAdmin();
  await prisma.blog.update({
    where: { id: blogId },
    data: { status: "PUBLISHED" },
  });
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  return { success: true };
}

export async function rejectBlog(blogId: string) {
  await checkAdmin();
  await prisma.blog.update({
    where: { id: blogId },
    data: { status: "REJECTED" },
  });
  revalidatePath("/admin/blogs");
  return { success: true };
}

export async function featureBlog(blogId: string, featured: boolean) {
  await checkAdmin();
  await prisma.blog.update({
    where: { id: blogId },
    data: { featured },
  });
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  return { success: true };
}

export async function createCategory(name: string) {
  await checkAdmin();
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  await prisma.category.create({ data: { name, slug } });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  await checkAdmin();
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
  return { success: true };
}
export async function getAllTags() {
  await checkAdmin();
  return prisma.tag.findMany({
    include: { _count: { select: { blogs: true } } },
    orderBy: { name: "asc" },
  });
}

export async function createTag(name: string) {
  await checkAdmin();
  const existing = await prisma.tag.findUnique({ where: { name } });
  if (existing) return { error: "Tag already exists" };
  await prisma.tag.create({ data: { name } });
  revalidatePath("/admin/tags");
  return { success: true };
}

export async function updateTag(tagId: string, name: string) {
  await checkAdmin();
  await prisma.tag.update({ where: { id: tagId }, data: { name } });
  revalidatePath("/admin/tags");
  return { success: true };
}

export async function deleteTag(tagId: string) {
  await checkAdmin();
  await prisma.tag.delete({ where: { id: tagId } });
  revalidatePath("/admin/tags");
  return { success: true };
}

export async function updateCategory(categoryId: string, name: string) {
  await checkAdmin();
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  await prisma.category.update({
    where: { id: categoryId },
    data: { name, slug },
  });
  revalidatePath("/admin/categories");
  return { success: true };
}
export async function editUser(
  userId: string,
  data: { name: string; role: string }
) {
  await checkAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { name: data.name, role: data.role as any },
  });
  revalidatePath("/admin/users");
  return { success: true };
}