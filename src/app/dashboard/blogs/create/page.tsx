"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import { createBlog } from "@/actions/blog.actions";
import {
  aiGenerateTitles,
  aiGenerateOutline,
  aiGenerateArticle,
  aiGenerateMeta,
  aiImproveReadability,
  aiRewriteContent,
  aiExpandContent,
  aiSummarizeContent,
} from "@/actions/ai.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Sparkles,
  Save,
  Send,
  ChevronDown,
  ChevronUp,
  Wand2,
  FileText,
  Search,
  Lightbulb,
} from "lucide-react";

export default function CreateBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [topic, setTopic] = useState("");
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(true);

  async function handleAI(action: string) {
    setAiLoading(action);
    try {
      if (action === "titles") {
        if (!topic) { toast.error("Enter a topic first"); return; }
        const res = await aiGenerateTitles(topic);
        if (res.success) setTitleSuggestions(res.data as string[]);
        else toast.error(res.error);
      } else if (action === "outline") {
        if (!title) { toast.error("Enter a title first"); return; }
        const res = await aiGenerateOutline(title);
        if (res.success) { setContent(res.data as string); toast.success("Outline generated!"); }
        else toast.error(res.error);
      } else if (action === "article") {
        if (!title) { toast.error("Enter a title first"); return; }
        const res = await aiGenerateArticle(title, content);
        if (res.success) { setContent(res.data as string); toast.success("Article generated!"); }
        else toast.error(res.error);
      } else if (action === "meta") {
        if (!title || !content) { toast.error("Add title and content first"); return; }
        const res = await aiGenerateMeta(title, content);
        if (res.success && res.data) {
          setSeoTitle((res.data as any).metaTitle);
          setMetaDesc((res.data as any).metaDesc);
          setKeywords((res.data as any).keywords);
          setSeoOpen(true);
          toast.success("SEO metadata generated!");
        } else toast.error(res.error);
      } else if (action === "readability") {
        if (!content) { toast.error("Add content first"); return; }
        const res = await aiImproveReadability(content);
        if (res.success) { setContent(res.data as string); toast.success("Readability improved!"); }
        else toast.error(res.error);
      } else if (action === "rewrite") {
        if (!content) { toast.error("Add content first"); return; }
        const res = await aiRewriteContent(content);
        if (res.success) { setContent(res.data as string); toast.success("Content rewritten!"); }
        else toast.error(res.error);
      } else if (action === "expand") {
        if (!content) { toast.error("Add content first"); return; }
        const res = await aiExpandContent(content);
        if (res.success) { setContent(res.data as string); toast.success("Content expanded!"); }
        else toast.error(res.error);
      } else if (action === "summarize") {
        if (!content) { toast.error("Add content first"); return; }
        const res = await aiSummarizeContent(content);
        if (res.success) { setContent(res.data as string); toast.success("Content summarized!"); }
        else toast.error(res.error);
      }
    } catch {
      toast.error("AI error occurred");
    } finally {
      setAiLoading(null);
    }
  }

  async function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    if (!title.trim()) { toast.error("Please add a title"); return; }
    if (!content.trim() || content === "<p></p>") { toast.error("Please add content"); return; }
    setSaving(true);
    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("content", content);
    formData.set("excerpt", excerpt || "");
    formData.set("seoTitle", seoTitle || "");
    formData.set("metaDescription", metaDesc || "");
    formData.set("keywords", keywords || "");
    formData.set("status", status);
    const result = await createBlog(formData);
    setSaving(false);
    if (result.error) { toast.error(result.error); }
    else {
      toast.success(status === "PUBLISHED" ? "Blog published!" : "Draft saved!");
      router.push("/dashboard/blogs");
    }
  }

  const AIButton = ({
    action,
    label,
    icon: Icon,
  }: {
    action: string;
    label: string;
    icon: any;
  }) => (
    <button
      type="button"
      onClick={() => handleAI(action)}
      disabled={aiLoading === action}
      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-50 border border-white/10"
    >
      {aiLoading === action ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      ) : (
        <Icon className="w-4 h-4 flex-shrink-0" />
      )}
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Blog</h1>
          <p className="text-gray-500 text-sm mt-1">
            Use AI to generate content or write manually
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => handleSubmit("DRAFT")}
            variant="outline"
            disabled={saving}
            className="rounded-xl"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={saving}
            className="rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor - 3/4 width */}
        <div className="lg:col-span-3 space-y-4">
          {/* Title */}
          <div className="bg-white rounded-2xl border p-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog title here..."
              className="text-2xl font-bold border-none shadow-none p-0 h-auto focus-visible:ring-0 placeholder:text-gray-300"
            />
          </div>

          {/* Editor */}
          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Content Editor</span>
            </div>
            <div className="p-4">
              <RichTextEditor
                content={content}
                onChange={(val) => setContent(val)}
                placeholder="Start writing your blog content here... or use AI to generate it →"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl border p-6">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Excerpt
              <span className="text-gray-400 font-normal ml-2">
                (Short description shown in blog listings)
              </span>
            </Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief summary of your blog post..."
              rows={3}
              className="resize-none rounded-xl"
            />
          </div>

          {/* SEO Section - Collapsible */}
          <div className="bg-white rounded-2xl border overflow-hidden">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                  <Search className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">SEO Settings</p>
                  <p className="text-xs text-gray-500">
                    Optimize for search engines
                  </p>
                </div>
              </div>
              {seoOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {seoOpen && (
              <div className="px-6 pb-6 space-y-4 border-t pt-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    SEO Title
                  </Label>
                  <Input
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="SEO optimized title (max 60 chars)"
                    className="mt-1 rounded-xl"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">
                      Shown in search results
                    </span>
                    <span
                      className={`text-xs font-medium ${seoTitle.length > 60 ? "text-red-500" : "text-gray-400"}`}
                    >
                      {seoTitle.length}/60
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Meta Description
                  </Label>
                  <Textarea
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    placeholder="Description shown in search results (max 160 chars)"
                    rows={3}
                    className="mt-1 rounded-xl resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">
                      Search result preview text
                    </span>
                    <span
                      className={`text-xs font-medium ${metaDesc.length > 160 ? "text-red-500" : "text-gray-400"}`}
                    >
                      {metaDesc.length}/160
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Focus Keywords
                  </Label>
                  <Input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    className="mt-1 rounded-xl"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Separate keywords with commas
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Sidebar - 1/4 width */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-gradient-to-b from-slate-900 to-blue-950 rounded-2xl overflow-hidden">
              {/* AI Header */}
              <button
                type="button"
                onClick={() => setAiOpen(!aiOpen)}
                className="w-full flex items-center justify-between p-5 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="font-bold">AI Assistant</span>
                </div>
                {aiOpen ? (
                  <ChevronUp className="w-4 h-4 text-blue-300" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-blue-300" />
                )}
              </button>

              {aiOpen && (
                <div className="px-4 pb-5 space-y-5">
                  {/* Title Generation */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      Generate Titles
                    </p>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter your topic..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-400 rounded-xl text-sm"
                    />
                    <AIButton
                      action="titles"
                      label="Generate Title Ideas"
                      icon={Lightbulb}
                    />
                    {titleSuggestions.length > 0 && (
                      <div className="space-y-1.5 mt-2">
                        <p className="text-xs text-blue-400">
                          Click to use:
                        </p>
                        {titleSuggestions.map((t, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setTitle(t);
                              toast.success("Title applied!");
                            }}
                            className="w-full text-left text-xs p-2.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-blue-100 transition-colors"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content Generation */}
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      Generate Content
                    </p>
                    <AIButton
                      action="outline"
                      label="Generate Outline"
                      icon={FileText}
                    />
                    <AIButton
                      action="article"
                      label="Generate Full Article"
                      icon={Wand2}
                    />
                  </div>

                  {/* SEO */}
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      SEO
                    </p>
                    <AIButton
                      action="meta"
                      label="Auto-Generate SEO"
                      icon={Search}
                    />
                  </div>

                  {/* Enhancement */}
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      Enhance Content
                    </p>
                    {[
                      { action: "readability", label: "Improve Readability", icon: Sparkles },
                      { action: "rewrite", label: "Rewrite Content", icon: Wand2 },
                      { action: "expand", label: "Expand Content", icon: FileText },
                      { action: "summarize", label: "Summarize", icon: Lightbulb },
                    ].map((item) => (
                      <AIButton key={item.action} {...item} />
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-xs text-blue-400 text-center leading-relaxed">
                      💡 Start with a topic → Generate titles → Pick one → Generate article → Auto-SEO
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}