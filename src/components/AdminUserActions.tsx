"use client";

import { useState } from "react";
import { suspendUser, activateUser, deleteUser } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminUserActions({ user }: { user: any }) {
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
    <div className="flex gap-2">
      {user.isSuspended ? (
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 hover:text-green-700"
          onClick={() =>
            handle(
              () => activateUser(user.id),
              "User activated",
              "activate"
            )
          }
          disabled={loading !== null}
        >
          {loading === "activate" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            "Activate"
          )}
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="text-yellow-600 hover:text-yellow-700"
          onClick={() =>
            handle(
              () => suspendUser(user.id),
              "User suspended",
              "suspend"
            )
          }
          disabled={loading !== null}
        >
          {loading === "suspend" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            "Suspend"
          )}
        </Button>
      )}
      <Button
        size="sm"
        variant="destructive"
        onClick={() => {
          if (confirm("Delete this user? This cannot be undone.")) {
            handle(
              () => deleteUser(user.id),
              "User deleted",
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