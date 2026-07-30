import { getAllUsers } from "@/actions/admin.actions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import AdminUserActions from "@/components/AdminUserActions";
import { Users } from "lucide-react";
import EditUserModal from "@/components/EditUserModal";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {users.length} total users
        </p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Role",
                    "Blogs",
                    "Status",
                    "Joined",
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
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">
                      {user.name || "—"}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          user.role === "ADMIN"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">
                      {user._count.blogs}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          user.isSuspended
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {user.isSuspended ? "Suspended" : "Active"}
                      </Badge>
                    </td>
                 <td className="p-4">
  <div className="flex gap-2 flex-wrap">
    <EditUserModal user={user} />
    <AdminUserActions user={user} />
  </div>
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