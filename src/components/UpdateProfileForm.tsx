"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateProfile, changePassword } from "@/actions/user.actions";
import { useRouter } from "next/navigation";

export default function UpdateProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  async function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    setSaving(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated!");
      router.refresh();
    }
  }

  async function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    const result = await changePassword(formData);
    setChangingPassword(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Password changed!");
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfile} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                name="name"
                defaultValue={user.name || ""}
                placeholder="Your name"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                name="bio"
                defaultValue={user.bio || ""}
                placeholder="Tell us about yourself..."
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Profile Image URL</Label>
              <Input
                name="profileImage"
                defaultValue={user.profileImage || ""}
                placeholder="https://example.com/avatar.jpg"
                className="mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">
                Paste a direct image URL
              </p>
            </div>
            <Button type="submit" disabled={saving}>
              {saving && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                name="newPassword"
                type="password"
                placeholder="Min 6 characters"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Repeat new password"
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" disabled={changingPassword}>
              {changingPassword && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}