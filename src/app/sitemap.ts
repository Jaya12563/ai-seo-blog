import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const blogUrls = blogs.map((blog) => ({
    url: `${process.env.NEXTAUTH_URL}/blog/${blog.slug}`,
    lastModified: blog.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${process.env.NEXTAUTH_URL}`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${process.env.NEXTAUTH_URL}/blogs`,
      lastModified: new Date(),
      priority: 0.9,
    },
    ...blogUrls,
  ];
}