import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileText, FolderOpen, Home, Tag, Settings } from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/blogs", icon: FileText, label: "Blogs" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { href: "/admin/tags", icon: Tag, label: "Tags" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <p className="text-lg font-bold">Admin Panel</p>
          <p className="text-xs text-gray-400 mt-1">AI SEO Blog</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Button
              key={href}
              asChild
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Link href={href}>
                <Icon className="w-4 h-4 mr-3" />
                {label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-3" />
              Back to Site
            </Link>
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}