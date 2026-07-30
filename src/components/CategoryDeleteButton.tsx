"use client";

import { deleteCategory } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function CategoryDeleteButton({
  categoryId,
}: {
  categoryId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handle() {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    await deleteCategory(categoryId);
    setLoading(false);
    toast.success("Category deleted");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handle}
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