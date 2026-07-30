"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import { updateBlog } from "@/actions/blog.actions";
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
import { Loader2, Save, Send } from "lucide-react";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      const res = await fetch(`/api/blogs/${blogId}`);
      if (res.ok) {
        const blog = await res.json();
        setTitle(blog.title || "");
        setContent(blog.content || "");
        setExcerpt(blog.excerpt || "");
        setSeoTitle(blog.seoTitle || "");
        setMetaDesc(blog.metaDescription || "");
        setKeywords(blog.keywords || "");
      }
      setLoading(false);
    }
    fetchBlog();
  }, [blogId]);

  async function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    setSaving(true);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content);
    formData.set("excerpt", excerpt);
    formData.set("seoTitle", seoTitle);
    formData.set("metaDescription", metaDesc);
    formData.set("keywords", keywords);
    formData.set("status", status);

    const result = await updateBlog(blogId, formData);
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Blog updated!");
      router.push("/dashboard/blogs");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Blog</h1>
        <p className="text-gray-500 text-sm mt-1">
          Make changes to your blog post
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog title..."
              className="mt-1 text-lg"
            />
          </div>
          <div>
            <Label>Content</Label>
            <div className="mt-1">
              <RichTextEditor
                content={content}
                onChange={setContent}
              />
            </div>
          </div>
          <div>
            <Label>Excerpt</Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description..."
              rows={3}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>SEO Title</Label>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="SEO title (max 60 chars)"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Meta Description</Label>
            <Textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              placeholder="Meta description (max 160 chars)"
              rows={2}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Keywords</Label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="keyword1, keyword2"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => handleSubmit("DRAFT")}
          variant="outline"
          disabled={saving}
          size="lg"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Draft
        </Button>
        <Button
          onClick={() => handleSubmit("PUBLISHED")}
          disabled={saving}
          size="lg"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Publish
        </Button>
      </div>
    </div>
  );
}