import { getAdminStats } from "@/actions/admin.actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, FileText, Eye, FolderOpen, BookOpen } from "lucide-react";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Blogs",
      value: stats.totalBlogs,
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Published",
      value: stats.publishedBlogs,
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Drafts",
      value: stats.draftBlogs,
      icon: BookOpen,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Platform overview and statistics
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(({ title, value, icon: Icon, color, bg }) => (
          <Card key={title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-2xl font-bold">{value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}