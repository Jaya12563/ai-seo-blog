import { getAllTags, createTag } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TagActions from "@/components/TagActions";
import { Tag } from "lucide-react";

export default async function AdminTagsPage() {
  const tags = await getAllTags();

  async function handleCreate(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    if (name?.trim()) await createTag(name.trim());
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tag Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {tags.length} tags total
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Add New Tag</h2>
        <form action={handleCreate} className="flex gap-3">
          <Input
            name="name"
            placeholder="Tag name e.g. javascript"
            className="max-w-sm"
            required
          />
          <Button type="submit">Add Tag</Button>
        </form>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {tags.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tags yet. Add one above.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Name", "Blogs", "Actions"].map((h) => (
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
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{tag.name}</td>
                  <td className="p-4">
                    <Badge variant="secondary">
                      {tag._count.blogs} blogs
                    </Badge>
                  </td>
                  <td className="p-4">
                    <TagActions tag={tag} />
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