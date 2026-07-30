"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
  excerpt: z.string().optional(),
  categoryId: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});
export async function createBlog(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string,
    categoryId: formData.get("categoryId") as string,
    seoTitle: formData.get("seoTitle") as string,
    metaDescription: formData.get("metaDescription") as string,
    keywords: formData.get("keywords") as string,
    status: (formData.get("status") as "DRAFT" | "PUBLISHED") || "DRAFT",
  };

  // Manual validation with clear errors
  if (!raw.title || raw.title.trim() === "") {
    return { error: "Title is required" };
  }
  if (!raw.content || raw.content.trim() === "" || raw.content === "<p></p>") {
    return { error: "Content is required" };
  }

  const slug = generateSlug(raw.title);
  const existing = await prisma.blog.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const blog = await prisma.blog.create({
    data: {
      title: raw.title.trim(),
      slug: finalSlug,
      content: raw.content,
      excerpt: raw.excerpt?.trim() ||
        raw.content.replace(/<[^>]*>/g, "").substring(0, 160),
      categoryId: raw.categoryId || null,
      seoTitle: raw.seoTitle?.trim() || raw.title.trim(),
      metaDescription: raw.metaDescription?.trim() || null,
      keywords: raw.keywords?.trim() || null,
      status: raw.status,
      authorId: session.user.id!,
    },
  });

  revalidatePath("/dashboard/blogs");
  revalidatePath("/blogs");
  return { success: true, blogId: blog.id, slug: blog.slug };
}


export async function updateBlog(blogId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) return { error: "Blog not found" };
  if (
    blog.authorId !== session.user.id &&
    (session.user as any).role !== "ADMIN"
  )
    return { error: "Forbidden" };

  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string,
    categoryId: formData.get("categoryId") as string,
    seoTitle: formData.get("seoTitle") as string,
    metaDescription: formData.get("metaDescription") as string,
    keywords: formData.get("keywords") as string,
    status: (formData.get("status") as "DRAFT" | "PUBLISHED") || blog.status,
  };

  await prisma.blog.update({
    where: { id: blogId },
    data: {
      title: raw.title,
      content: raw.content,
      excerpt: raw.excerpt,
      categoryId: raw.categoryId || null,
      seoTitle: raw.seoTitle,
      metaDescription: raw.metaDescription,
      keywords: raw.keywords,
      status: raw.status,
    },
  });

  revalidatePath("/dashboard/blogs");
  revalidatePath(`/blog/${blog.slug}`);
  return { success: true };
}

export async function deleteBlog(blogId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) return { error: "Not found" };
  if (
    blog.authorId !== session.user.id &&
    (session.user as any).role !== "ADMIN"
  )
    return { error: "Forbidden" };

  await prisma.blog.delete({ where: { id: blogId } });
  revalidatePath("/dashboard/blogs");
  revalidatePath("/blogs");
  return { success: true };
}
export async function unpublishBlog(blogId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) return { error: "Not found" };
  if (
    blog.authorId !== session.user.id &&
    (session.user as any).role !== "ADMIN"
  )
    return { error: "Forbidden" };

  await prisma.blog.update({
    where: { id: blogId },
    data: { status: "DRAFT" },
  });

  revalidatePath("/dashboard/blogs");
  revalidatePath("/blogs");
  return { success: true };
}

export async function toggleLike(blogId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const existing = await prisma.like.findUnique({
    where: {
      userId_blogId: { userId: session.user.id!, blogId },
    },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { userId: session.user.id!, blogId },
    });
  }
  revalidatePath(`/blog`);
  return { success: true };
}

export async function toggleBookmark(blogId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_blogId: { userId: session.user.id!, blogId },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
  } else {
    await prisma.bookmark.create({
      data: { userId: session.user.id!, blogId },
    });
  }
  revalidatePath(`/blog`);
  return { success: true };
}

export async function getPublishedBlogs(
  search?: string,
  categoryId?: string
) {
  return prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { keywords: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(categoryId && { categoryId }),
    },
    include: {
      author: {
        select: { id: true, name: true, profileImage: true },
      },
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { likes: true, bookmarks: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserBlogs() {
  const session = await auth();
  if (!session?.user) return [];
  return prisma.blog.findMany({
    where: { authorId: session.user.id! },
    include: {
      category: true,
      _count: { select: { likes: true, bookmarks: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}