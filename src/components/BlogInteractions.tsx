"use client";

import { useState } from "react";
import { toggleLike, toggleBookmark } from "@/actions/blog.actions";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  blogId: string;
  blogUrl: string;
  blogTitle: string;
  initialLikes: number;
  initialBookmarks: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isLoggedIn: boolean;
}

export default function BlogInteractions({
  blogId,
  blogUrl,
  blogTitle,
  initialLikes,
  initialBookmarks,
  isLiked,
  isBookmarked,
  isLoggedIn,
}: Props) {
  const router = useRouter();
  const [liked, setLiked] = useState(isLiked);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [likes, setLikes] = useState(initialLikes);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [copied, setCopied] = useState(false);

  async function handleLike() {
    if (!isLoggedIn) {
      toast.error("Please sign in to like articles");
      router.push("/sign-in");
      return;
    }
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    await toggleLike(blogId);
  }

  async function handleBookmark() {
    if (!isLoggedIn) {
      toast.error("Please sign in to bookmark articles");
      router.push("/sign-in");
      return;
    }
    setBookmarked(!bookmarked);
    setBookmarks(bookmarked ? bookmarks - 1 : bookmarks + 1);
    await toggleBookmark(blogId);
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blogTitle,
          url: blogUrl,
        });
      } else {
        await navigator.clipboard.writeText(blogUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(blogUrl);
      toast.success("Link copied!");
    }
  }

  return (
    <div className="flex items-center gap-3 mt-8 pt-6 border-t">
      <Button
        variant={liked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        className="gap-2"
      >
        <Heart
          className={`w-4 h-4 ${liked ? "fill-current" : ""}`}
        />
        {likes} {likes === 1 ? "Like" : "Likes"}
      </Button>

      <Button
        variant={bookmarked ? "default" : "outline"}
        size="sm"
        onClick={handleBookmark}
        className="gap-2"
      >
        <Bookmark
          className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`}
        />
        {bookmarks} {bookmarks === 1 ? "Bookmark" : "Bookmarks"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="gap-2"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        {copied ? "Copied!" : "Share"}
      </Button>
    </div>
  );
}