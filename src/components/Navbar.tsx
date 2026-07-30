"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PenSquare,
  LayoutDashboard,
  LogOut,
  Shield,
  User,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role;

  function handleSignOut() {
    router.push("/sign-out");
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          AI SEO Blog
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/blogs"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Blogs
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/blogs/create">
                  <PenSquare className="w-4 h-4 mr-2" />
                  Write
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none">
                    <Avatar className="w-8 h-8 cursor-pointer">
                      <AvatarImage src={session.user.image || ""} />
                      <AvatarFallback>
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-semibold truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </p>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">
                      {role}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}