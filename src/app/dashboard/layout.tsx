"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  User,
  Home,
  Sparkles,
  LogOut,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/dashboard/blogs", icon: FileText, label: "My Blogs" },
  { href: "/dashboard/blogs/create", icon: PenSquare, label: "Create Blog" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-blue-950 text-white flex flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">AI SEO Blog</p>
              <p className="text-xs text-blue-400">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 mx-4 mt-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-blue-400">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-blue-600 text-white font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-blue-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 mt-2">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider px-3 mb-3">
            Menu
          </p>
          {navItems.map(({ href, icon: Icon, label, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href) && href !== "/dashboard";
            const isOverviewActive = exact && pathname === "/dashboard";

            const active = exact ? isOverviewActive : isActive;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{label}</span>
                {active && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium text-sm">Back to Site</span>
          </Link>
          <button
            onClick={() => router.push("/sign-out")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        {/* Top Bar */}
        <header className="bg-white border-b sticky top-0 z-30 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900 text-lg">
              {navItems.find((item) =>
                item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              )?.label || "Dashboard"}
            </h1>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              asChild
            >
              <Link href="/dashboard/blogs/create">
                <PenSquare className="w-4 h-4 mr-2" />
                New Blog
              </Link>
            </Button>
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
              <Bell className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}