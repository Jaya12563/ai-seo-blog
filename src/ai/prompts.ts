import { callClaude } from "./claude";

export async function generateBlogTitles(topic: string): Promise<string[]> {
  const prompt = `Generate 5 SEO-optimized blog titles for the topic: "${topic}".
Return ONLY a JSON array of strings, nothing else.
Example: ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"]`;

  const result = await callClaude(prompt);
  try {
    return JSON.parse(result);
  } catch {
    return result.split("\n").filter((t) => t.trim()).slice(0, 5);
  }
}

export async function generateOutline(title: string): Promise<string> {
  const prompt = `Create a detailed blog post outline for: "${title}".
Include H2 and H3 headings. Return as clean HTML using only <h2> and <h3> tags with brief notes under each section as <p> tags.`;
  return await callClaude(prompt);
}

export async function generateFullArticle(
  title: string,
  outline?: string
): Promise<string> {
  const prompt = `Write a comprehensive, SEO-optimized blog article for the title: "${title}".
${outline ? `Follow this outline:\n${outline}` : ""}
Requirements:
- Minimum 800 words
- Use proper HTML tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>
- Include an introduction and conclusion
- Natural keyword placement
- Engaging and informative tone
Return ONLY the HTML content, no extra explanation.`;
  return await callClaude(prompt);
}

export async function generateMetaTitle(title: string): Promise<string> {
  const prompt = `Generate an SEO meta title for this blog post: "${title}".
Rules: under 60 characters, includes primary keyword, compelling.
Return ONLY the meta title text, nothing else.`;
  return await callClaude(prompt);
}

export async function generateMetaDescription(
  content: string
): Promise<string> {
  const text = content.replace(/<[^>]*>/g, "").substring(0, 500);
  const prompt = `Generate an SEO meta description for this blog content:
"${text}"
Rules: 150-160 characters, includes keywords, has a call to action.
Return ONLY the meta description text, nothing else.`;
  return await callClaude(prompt);
}

export async function generateKeywords(content: string): Promise<string> {
  const text = content.replace(/<[^>]*>/g, "").substring(0, 500);
  const prompt = `Extract 5-8 SEO focus keywords from this content:
"${text}"
Return ONLY a comma-separated list of keywords, nothing else.`;
  return await callClaude(prompt);
}

export async function improveContent(
  content: string,
  instruction: string
): Promise<string> {
  const prompt = `${instruction} for the following content:
"${content}"
Return ONLY the improved HTML content, nothing else.`;
  return await callClaude(prompt);
}
export async function improveReadability(content: string): Promise<string> {
  const prompt = `Improve the readability of this blog content. Make it clearer, more engaging, and easier to read. Keep the same meaning and HTML structure:
"${content}"
Return ONLY the improved HTML content, nothing else.`;
  return await callClaude(prompt);
}

export async function rewriteContent(content: string): Promise<string> {
  const prompt = `Rewrite this blog content in a fresh, engaging way while keeping the same key points and HTML structure:
"${content}"
Return ONLY the rewritten HTML content, nothing else.`;
  return await callClaude(prompt);
}

export async function expandContent(content: string): Promise<string> {
  const prompt = `Expand this blog content by adding more details, examples, and explanations. Keep the existing HTML structure and add to it:
"${content}"
Return ONLY the expanded HTML content, nothing else.`;
  return await callClaude(prompt);
}

export async function summarizeContent(content: string): Promise<string> {
  const prompt = `Summarize this blog content into a concise version keeping the most important points. Use proper HTML tags:
"${content}"
Return ONLY the summarized HTML content, nothing else.`;
  return await callClaude(prompt);
}