import { getUserBlogs } from "@/actions/blog.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  PenSquare,
  Eye,
  Plus,
  FileText,
  Heart,
  EyeOff,
  Trash2,
  Search,
} from "lucide-react";
import DeleteBlogButton from "@/components/DeleteBlogButton";
import UnpublishButton from "@/components/UnpublishButton";

export default async function MyBlogsPage() {
  const blogs = await getUserBlogs();

  const published = blogs.filter((b) => b.status === "PUBLISHED");
  const drafts = blogs.filter((b) => b.status === "DRAFT");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Blogs</h1>
          <p className="text-gray-500 text-sm mt-1">
            {blogs.length} total · {published.length} published · {drafts.length} drafts
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/dashboard/blogs/create">
            <Plus className="w-4 h-4 mr-2" />
            New Blog
          </Link>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: blogs.length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Published", value: published.length, color: "text-green-600", bg: "bg-green-50" },
          { label: "Drafts", value: drafts.length, color: "text-yellow-600", bg: "bg-yellow-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-600 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Blog List */}
      {blogs.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-blue-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No blogs yet
          </h3>
          <p className="text-gray-400 mb-6">
            Create your first AI-powered blog post
          </p>
          <Button asChild className="rounded-xl">
            <Link href="/dashboard/blogs/create">
              <Plus className="w-4 h-4 mr-2" />
              Create First Blog
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {blogs.length} blog{blogs.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
              >
                {/* Blog Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>

                {/* Blog Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <Badge
                      variant={
                        blog.status === "PUBLISHED"
                          ? "default"
                          : blog.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {blog.status}
                    </Badge>
                    {blog.category && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {blog.category.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-400" />
                    {blog._count.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    {blog.views}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {blog.status === "PUBLISHED" && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="rounded-lg text-gray-500 hover:text-blue-600"
                      title="View"
                    >
                      <Link href={`/blog/${blog.slug}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="rounded-lg text-gray-500 hover:text-blue-600"
                    title="Edit"
                  >
                    <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                      <PenSquare className="w-4 h-4" />
                    </Link>
                  </Button>
                  {blog.status === "PUBLISHED" && (
                    <UnpublishButton blogId={blog.id} />
                  )}
                  <DeleteBlogButton blogId={blog.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}