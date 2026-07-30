import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { FileText, Heart, Eye, Calendar } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id! },
    include: {
      _count: { select: { blogs: true, likes: true } },
    },
  });

  const totalViews = await prisma.blog.aggregate({
    where: { authorId: session!.user!.id! },
    _sum: { views: true },
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white/30">
                <AvatarImage src={user.profileImage || ""} />
                <AvatarFallback className="bg-blue-500 text-white text-2xl font-bold">
                  {user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-bold text-xl">{user.name}</h2>
              <p className="text-blue-200 text-sm mt-1">{user.email}</p>
              <Badge className="mt-3 bg-white/20 text-white border-white/30 hover:bg-white/30">
                {user.role}
              </Badge>
              {user.bio && (
                <p className="text-blue-100 text-sm mt-3 leading-relaxed">
                  {user.bio}
                </p>
              )}
              <div className="flex items-center justify-center gap-1 mt-3 text-blue-200 text-xs">
                <Calendar className="w-3 h-3" />
                Member since {formatDate(user.createdAt)}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Blogs",
                  value: user._count.blogs,
                  icon: FileText,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Likes",
                  value: user._count.likes,
                  icon: Heart,
                  color: "text-red-500",
                  bg: "bg-red-50",
                },
                {
                  label: "Views",
                  value: totalViews._sum.views || 0,
                  icon: Eye,
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div
                  key={label}
                  className={`${bg} rounded-xl p-3 text-center`}
                >
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <UpdateProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}