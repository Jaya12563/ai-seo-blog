"use client";

import { useState } from "react";
import { updateTag, deleteTag } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TagActions({ tag }: { tag: any }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(tag.name);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    const result = await updateTag(tag.id, name);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Tag updated");
      setEditing(false);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this tag?")) return;
    setLoading(true);
    await deleteTag(tag.id);
    setLoading(false);
    toast.success("Tag deleted");
    router.refresh();
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8 w-40"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4 text-green-600" />
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditing(false)}
        >
          <X className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setEditing(true)}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleDelete}
        disabled={loading}
        className="text-red-500 hover:text-red-700"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}