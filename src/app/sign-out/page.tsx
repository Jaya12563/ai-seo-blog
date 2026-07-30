"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  useEffect(() => {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Signing out...</p>
      </div>
    </div>
  );
}