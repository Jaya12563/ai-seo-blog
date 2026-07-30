import { prisma } from "@/lib/prisma";
import { createCategory } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CategoryDeleteButton from "@/components/CategoryDeleteButton";
import { FolderOpen } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { blogs: true } } },
    orderBy: { name: "asc" },
  });

  async function handleCreate(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    if (name?.trim()) await createCategory(name.trim());
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {categories.length} categories
        </p>
      </div>

      {/* Add Category */}
      <div className="bg-white border rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Add New Category</h2>
        <form action={handleCreate} className="flex gap-3">
          <Input
            name="name"
            placeholder="Category name e.g. Technology"
            className="max-w-sm"
            required
          />
          <Button type="submit">Add Category</Button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No categories yet. Add one above.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Name", "Slug", "Blogs", "Actions"].map((h) => (
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
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {cat.slug}
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">
                      {cat._count.blogs} blogs
                    </Badge>
                  </td>
                  <td className="p-4">
                    <CategoryDeleteButton categoryId={cat.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}