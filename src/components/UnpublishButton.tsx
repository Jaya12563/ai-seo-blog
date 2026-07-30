"use client";

import { useState } from "react";
import { unpublishBlog } from "@/actions/blog.actions";
import { Button } from "@/components/ui/button";
import { EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UnpublishButton({ blogId }: { blogId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle() {
    if (!confirm("Unpublish this blog? It will become a draft."))
      return;
    setLoading(true);
    const result = await unpublishBlog(blogId);
    setLoading(false);
    if (result.success) {
      toast.success("Blog unpublished");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to unpublish");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handle}
      disabled={loading}
      className="text-yellow-600 hover:text-yellow-700"
      title="Unpublish"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <EyeOff className="w-4 h-4" />
      )}
    </Button>
  );
}