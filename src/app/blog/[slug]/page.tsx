import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { formatDate, readingTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Calendar } from "lucide-react";
import { auth } from "@/lib/auth";
import BlogInteractions from "@/components/BlogInteractions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({ where: { slug } });
  if (!blog) return { title: "Not Found" };
  return {
    title: blog.seoTitle || blog.title,
    description: blog.metaDescription || blog.excerpt || "",
    keywords: blog.keywords || "",
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.metaDescription || "",
      images: blog.coverImage ? [blog.coverImage] : [],
    },
    alternates: {
      canonical: `${process.env.NEXTAUTH_URL}/blog/${slug}`,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const blog = await prisma.blog.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true, profileImage: true, bio: true } },
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { likes: true, bookmarks: true } },
      likes: session?.user ? { where: { userId: session.user.id! } } : false,
      bookmarks: session?.user ? { where: { userId: session.user.id! } } : false,
    },
  });

  if (!blog) notFound();

  await prisma.blog.update({
    where: { id: blog.id },
    data: { views: { increment: 1 } },
  });

  const isLiked = blog.likes && blog.likes.length > 0;
  const isBookmarked = blog.bookmarks && blog.bookmarks.length > 0;
  const blogUrl = `${process.env.NEXTAUTH_URL}/blog/${slug}`;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Button asChild variant="ghost" className="text-blue-300 hover:text-white hover:bg-white/10 mb-6 rounded-xl">
            <Link href="/blogs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </Button>
          {blog.category && (
            <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/30 mb-4">
              {blog.category.name}
            </Badge>
          )}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-blue-200 text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 border-2 border-blue-400">
                <AvatarImage src={blog.author.profileImage || ""} />
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  {blog.author.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-white">{blog.author.name}</span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(blog.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readingTime(blog.content)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {blog.views} views
            </span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="max-w-4xl mx-auto px-4 -mt-8">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-72 object-cover rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-10 pt-6 border-t">
                {blog.tags.map(({ tag }) => (
                  <Badge key={tag.id} variant="outline" className="rounded-full">
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Interactions */}
            <BlogInteractions
              blogId={blog.id}
              blogUrl={blogUrl}
              blogTitle={blog.title}
              initialLikes={blog._count.likes}
              initialBookmarks={blog._count.bookmarks}
              isLiked={!!isLiked}
              isBookmarked={!!isBookmarked}
              isLoggedIn={!!session?.user}
            />

            {/* Author Card */}
            <div className="mt-10 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-start gap-4">
              <Avatar className="w-16 h-16 border-2 border-blue-200 flex-shrink-0">
                <AvatarImage src={blog.author.profileImage || ""} />
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {blog.author.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Written by</p>
                <p className="font-bold text-gray-900 text-lg">{blog.author.name}</p>
                {blog.author.bio && (
                  <p className="text-gray-600 text-sm mt-1">{blog.author.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-4 border">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Article Info</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Views</span>
                    <span className="font-semibold text-gray-900">{blog.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Likes</span>
                    <span className="font-semibold text-gray-900">{blog._count.likes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Read time</span>
                    <span className="font-semibold text-gray-900">{readingTime(blog.content)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Published</span>
                    <span className="font-semibold text-gray-900">{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
              </div>
              {!session?.user && (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white text-center">
                  <p className="font-bold mb-2">Join the community</p>
                  <p className="text-blue-100 text-xs mb-4">Sign up to like, bookmark and share articles</p>
                  <Button asChild size="sm" className="bg-white text-blue-700 hover:bg-blue-50 w-full rounded-xl">
                    <Link href="/sign-up">Get Started Free</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}