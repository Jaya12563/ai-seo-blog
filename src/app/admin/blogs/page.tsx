import { getAllBlogsAdmin } from "@/actions/admin.actions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import AdminBlogActions from "@/components/AdminBlogActions";
import { FileText } from "lucide-react";

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogsAdmin();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Blog Moderation</h1>
        <p className="text-gray-500 text-sm mt-1">
          {blogs.length} total blogs
        </p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No blogs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {[
                    "Title",
                    "Author",
                    "Status",
                    "Featured",
                    "Likes",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left p-4 text-sm font-medium text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium max-w-xs">
                      <p className="truncate">{blog.title}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {blog.author.name}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          blog.status === "PUBLISHED"
                            ? "default"
                            : blog.status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {blog.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {blog.featured ? (
                        <Badge variant="outline" className="text-yellow-600">
                          ⭐ Featured
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      {blog._count.likes}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="p-4">
                      <AdminBlogActions blog={blog} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}