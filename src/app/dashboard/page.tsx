import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Eye,
  Heart,
  TrendingUp,
  PenSquare,
  ArrowRight,
  Sparkles,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const userId = session.user.id!;

  const [totalBlogs, published, drafts, blogs] = await Promise.all([
    prisma.blog.count({ where: { authorId: userId } }),
    prisma.blog.count({ where: { authorId: userId, status: "PUBLISHED" } }),
    prisma.blog.count({ where: { authorId: userId, status: "DRAFT" } }),
    prisma.blog.findMany({
      where: { authorId: userId },
      include: { _count: { select: { likes: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totalViews = await prisma.blog.aggregate({
    where: { authorId: userId },
    _sum: { views: true },
  });

  const stats = [
    {
      title: "Total Blogs",
      value: totalBlogs,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      trend: "+12%",
    },
    {
      title: "Published",
      value: published,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      trend: "+8%",
    },
    {
      title: "Drafts",
      value: drafts,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      trend: "",
    },
    {
      title: "Total Views",
      value: totalViews._sum.views || 0,
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      trend: "+24%",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {session.user.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-blue-100">
              You have {drafts} draft{drafts !== 1 ? "s" : ""} waiting to be published.
              Keep writing!
            </p>
          </div>
          <Button
            asChild
            className="bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-semibold"
          >
            <Link href="/dashboard/blogs/create">
              <PenSquare className="w-4 h-4 mr-2" />
              Write New Blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ title, value, icon: Icon, color, bg, border, trend }) => (
          <div
            key={title}
            className={`bg-white rounded-2xl p-5 border ${border} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              {trend && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {trend}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            title: "Create with AI",
            desc: "Generate a full blog post with AI assistance",
            icon: Sparkles,
            href: "/dashboard/blogs/create",
            color: "from-blue-500 to-indigo-600",
          },
          {
            title: "View My Blogs",
            desc: "Manage and edit your existing blog posts",
            icon: FileText,
            href: "/dashboard/blogs",
            color: "from-purple-500 to-pink-600",
          },
          {
            title: "Update Profile",
            desc: "Edit your profile and account settings",
            icon: Eye,
            href: "/dashboard/profile",
            color: "from-orange-500 to-red-500",
          },
        ].map(({ title, desc, icon: Icon, href, color }) => (
          <Link key={title} href={href}>
            <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}>
              <Icon className="w-8 h-8 mb-3 opacity-90" />
              <h3 className="font-bold text-lg mb-1">{title}</h3>
              <p className="text-white/70 text-sm">{desc}</p>
              <ArrowRight className="w-5 h-5 mt-4 opacity-70" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Blogs */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Recent Blogs</h2>
            <p className="text-gray-500 text-sm mt-0.5">Your latest articles</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href="/dashboard/blogs">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="divide-y">
          {blogs.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No blogs yet</p>
              <p className="text-gray-400 text-sm mb-4">
                Create your first blog post
              </p>
              <Button asChild size="sm" className="rounded-xl">
                <Link href="/dashboard/blogs/create">
                  <PenSquare className="w-4 h-4 mr-2" />
                  Create Blog
                </Link>
              </Button>
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {blog.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge
                      variant={
                        blog.status === "PUBLISHED" ? "default" : "secondary"
                      }
                      className="text-xs py-0"
                    >
                      {blog.status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {blog._count.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {blog.views}
                  </span>
                  <Button asChild variant="ghost" size="sm" className="rounded-lg">
                    <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}