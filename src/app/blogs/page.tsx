import { getPublishedBlogs } from "@/actions/blog.actions";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, FileText, ArrowRight } from "lucide-react";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [blogs, categories] = await Promise.all([
    getPublishedBlogs(params.search, params.category),
    prisma.category.findMany(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Articles
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            Discover AI-powered insights and expert knowledge
          </p>
          <form className="flex gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Search articles..."
                defaultValue={params.search}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 h-12 rounded-xl"
              />
            </div>
            <Button type="submit" className="bg-white text-blue-900 hover:bg-blue-50 h-12 px-6 rounded-xl font-semibold">
              Search
            </Button>
            {params.search && (
              <Button variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 h-12 rounded-xl">
                <Link href="/blogs">Clear</Link>
              </Button>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-8">
          <Button
            asChild
            variant={!params.category ? "default" : "outline"}
            size="sm"
            className="rounded-full"
          >
            <Link href="/blogs">All Topics</Link>
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              asChild
              variant={params.category === cat.id ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              <Link href={`/blogs?category=${cat.id}`}>{cat.name}</Link>
            </Button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-sm mb-6">
          {blogs.length} article{blogs.length !== 1 ? "s" : ""} found
          {params.search && ` for "${params.search}"`}
        </p>

        {blogs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border">
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No articles found
            </h3>
            <p className="text-gray-400 mb-6">
              Try a different search term or browse all articles
            </p>
            <Button asChild className="rounded-xl">
              <Link href="/blogs">View All Articles</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`}>
                <article className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden flex-shrink-0">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-blue-200" />
                      </div>
                    )}
                    {blog.category && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {blog.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {blog.excerpt.replace(/<[^>]*>/g, "")}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {blog.author.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-500">{blog.author.name}</span>
                      </div>
                      <span className="text-blue-600 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}