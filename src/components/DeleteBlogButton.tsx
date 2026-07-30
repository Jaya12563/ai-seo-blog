"use client";

import { useState } from "react";
import { deleteBlog } from "@/actions/blog.actions";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteBlogButton({ blogId }: { blogId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setLoading(true);
    const result = await deleteBlog(blogId);
    setLoading(false);
    if (result.success) {
      toast.success("Blog deleted successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete blog");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}