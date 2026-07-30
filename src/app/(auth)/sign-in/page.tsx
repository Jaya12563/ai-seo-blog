"use client";

import { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Sparkles } from "lucide-react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await loginUser(formData);
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      }
    } catch (error: any) {
      if (
        error?.message?.includes("NEXT_REDIRECT") ||
        error?.digest?.includes("NEXT_REDIRECT")
      ) {
        return;
      }
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-blue-300" />
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
        <p className="text-blue-300 text-sm mt-1">
          Sign in to continue writing
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
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
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-400 h-12 rounded-xl focus:border-blue-400 focus:ring-blue-400"
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
              placeholder="Your password"
              required
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-400 h-12 rounded-xl focus:border-blue-400 focus:ring-blue-400"
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-blue-300 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-white font-semibold hover:text-blue-200 transition-colors"
          >
            Sign Up Free
          </Link>
        </p>
      </div>
      <div className="mt-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center">
        <p className="text-blue-300 text-xs">
          Admin? Use your admin credentials to access the admin panel automatically.
        </p>
      </div>
    </div>
  );
}