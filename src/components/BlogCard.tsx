import Link from "next/link";
import { BlogWithAuthor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, readingTime, stripHtml } from "@/lib/utils";
import { Heart, Bookmark } from "lucide-react";

export default function BlogCard({ blog }: { blog: BlogWithAuthor }) {
  return (
    <article className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {blog.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        {blog.category && (
          <Badge variant="secondary" className="mb-3 text-xs">
            {blog.category.name}
          </Badge>
        )}
        <Link href={`/blog/${blog.slug}`}>
          <h2 className="font-bold text-lg leading-tight mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {blog.title}
          </h2>
        </Link>
        {blog.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {stripHtml(blog.excerpt)}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={blog.author.profileImage || ""} />
              <AvatarFallback className="text-xs">
                {blog.author.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">
              {blog.author.name}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">
              {readingTime(blog.content)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-xs">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {blog._count?.likes || 0}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="w-3 h-3" />
              {blog._count?.bookmarks || 0}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          {formatDate(blog.createdAt)}
        </p>
      </div>
    </article>
  );
}