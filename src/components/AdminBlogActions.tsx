"use client";

import { useState } from "react";
import {
  approveBlog,
  rejectBlog,
  featureBlog,
} from "@/actions/admin.actions";
import { deleteBlog } from "@/actions/blog.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminBlogActions({ blog }: { blog: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handle(
    action: () => Promise<any>,
    msg: string,
    key: string
  ) {
    setLoading(key);
    await action();
    setLoading(null);
    toast.success(msg);
    router.refresh();
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {blog.status !== "PUBLISHED" && (
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 hover:text-green-700"
          onClick={() =>
            handle(
              () => approveBlog(blog.id),
              "Blog approved",
              "approve"
            )
          }
          disabled={loading !== null}
        >
          {loading === "approve" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            "Approve"
          )}
        </Button>
      )}
      {blog.status === "PUBLISHED" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            handle(
              () => featureBlog(blog.id, !blog.featured),
              blog.featured ? "Unfeatured" : "Featured!",
              "feature"
            )
          }
          disabled={loading !== null}
        >
          {loading === "feature" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : blog.featured ? (
            "Unfeature"
          ) : (
            "Feature"
          )}
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        className="text-red-600 hover:text-red-700"
        onClick={() =>
          handle(() => rejectBlog(blog.id), "Blog rejected", "reject")
        }
        disabled={loading !== null}
      >
        {loading === "reject" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          "Reject"
        )}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => {
          if (confirm("Permanently delete this blog?")) {
            handle(
              () => deleteBlog(blog.id),
              "Blog deleted",
              "delete"
            );
          }
        }}
        disabled={loading !== null}
      >
        {loading === "delete" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          "Delete"
        )}
      </Button>
    </div>
  );
}