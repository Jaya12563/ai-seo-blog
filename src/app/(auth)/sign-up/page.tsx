"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Sparkles } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Account created! Please sign in.");
      router.push("/sign-in");
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-blue-300" />
        </div>
        <h2 className="text-2xl font-bold text-white">Create account</h2>
        <p className="text-blue-300 text-sm mt-1">
          Start writing AI-powered blogs today
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label className="text-blue-200 text-sm font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
            <Input
              name="name"
              placeholder="John Doe"
              required
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-400 h-12 rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-blue-200 text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
            <Input
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-400 h-12 rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-blue-200 text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
            <Input
              name="password"
              type="password"
              placeholder="Min 6 characters"
              required
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-400 h-12 rounded-xl"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 rounded-xl font-semibold text-base"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-blue-300 text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-white font-semibold hover:text-blue-200 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}