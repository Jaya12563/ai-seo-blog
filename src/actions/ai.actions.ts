"use server";

import { auth } from "@/lib/auth";
import {
  generateBlogTitles,
  generateOutline,
  generateFullArticle,
  generateMetaTitle,
  generateMetaDescription,
  generateKeywords,
  improveContent,
  improveReadability,
  rewriteContent,
  expandContent,
  summarizeContent,
} from "@/ai/prompts";

async function checkAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function aiGenerateTitles(topic: string) {
  await checkAuth();
  try {
    const titles = await generateBlogTitles(topic);
    return { success: true, data: titles };
  } catch {
    return { error: "Failed to generate titles" };
  }
}

export async function aiGenerateOutline(title: string) {
  await checkAuth();
  try {
    const outline = await generateOutline(title);
    return { success: true, data: outline };
  } catch {
    return { error: "Failed to generate outline" };
  }
}

export async function aiGenerateArticle(title: string, outline?: string) {
  await checkAuth();
  try {
    const article = await generateFullArticle(title, outline);
    return { success: true, data: article };
  } catch {
    return { error: "Failed to generate article" };
  }
}

export async function aiGenerateMeta(title: string, content: string) {
  await checkAuth();
  try {
    const [metaTitle, metaDesc, keywords] = await Promise.all([
      generateMetaTitle(title),
      generateMetaDescription(content),
      generateKeywords(content),
    ]);
    return {
      success: true,
      data: { metaTitle, metaDesc, keywords },
    };
  } catch {
    return { error: "Failed to generate metadata" };
  }
}

export async function aiImproveContent(
  content: string,
  instruction: string
) {
  await checkAuth();
  try {
    const improved = await improveContent(content, instruction);
    return { success: true, data: improved };
  } catch {
    return { error: "Failed to improve content" };
  }
}
export async function aiImproveReadability(content: string) {
  await checkAuth();
  try {
    const improved = await improveReadability(content);
    return { success: true, data: improved };
  } catch {
    return { error: "Failed to improve readability" };
  }
}

export async function aiRewriteContent(content: string) {
  await checkAuth();
  try {
    const rewritten = await rewriteContent(content);
    return { success: true, data: rewritten };
  } catch {
    return { error: "Failed to rewrite content" };
  }
}

export async function aiExpandContent(content: string) {
  await checkAuth();
  try {
    const expanded = await expandContent(content);
    return { success: true, data: expanded };
  } catch {
    return { error: "Failed to expand content" };
  }
}

export async function aiSummarizeContent(content: string) {
  await checkAuth();
  try {
    const summary = await summarizeContent(content);
    return { success: true, data: summary };
  } catch {
    return { error: "Failed to summarize content" };
  }
}