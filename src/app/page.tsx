import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { Sparkles, Zap, Search, TrendingUp, Users, FileText, ArrowRight, Star } from "lucide-react";

export default async function HomePage() {
  const [recentBlogs, totalBlogs, totalUsers] = await Promise.all([
    prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: { select: { name: true, profileImage: true } },
        category: true,
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.blog.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count(),
  ]);

  const featuredBlog = recentBlogs[0];
  const otherBlogs = recentBlogs.slice(1, 6);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">AI-Powered Content Creation</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Write Smarter,
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Rank Higher
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
              Create SEO-optimized blog articles in minutes with the power of AI. Generate titles, outlines, and full articles automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold text-base px-8 py-6 rounded-xl">
                <Link href="/sign-up">
                  Start Writing Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8 py-6 rounded-xl backdrop-blur-sm">
                <Link href="/blogs">Explore Articles</Link>
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { icon: FileText, value: `${totalBlogs}+`, label: "Articles Published" },
              { icon: Users, value: `${totalUsers}+`, label: "Writers Joined" },
              { icon: TrendingUp, value: "100%", label: "SEO Optimized" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Icon className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-blue-200">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1440 40 1080 0 720 0C360 0 0 40 0 40L0 80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Featured Blog */}
      {featuredBlog && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Article</h2>
              <p className="text-gray-500 mt-1">Hand-picked by our editors</p>
            </div>
          </div>
          <Link href={`/blog/${featuredBlog.slug}`}>
            <div className="group relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl overflow-hidden h-96 flex items-end cursor-pointer hover:shadow-2xl transition-shadow duration-300">
              {featuredBlog.coverImage ? (
                <img
                  src={featuredBlog.coverImage}
                  alt={featuredBlog.title}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:opacity-60 transition-opacity"
                />
              ) : (
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-2xl" />
                  <div className="absolute bottom-10 left-10 w-32 h-32 bg-white rounded-full blur-xl" />
                </div>
              )}
              <div className="relative p-8 text-white">
                {featuredBlog.category && (
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {featuredBlog.category.name}
                  </span>
                )}
                <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-blue-200 transition-colors">
                  {featuredBlog.title}
                </h3>
                <div className="flex items-center gap-3 text-blue-200 text-sm">
                  <span>{featuredBlog.author.name}</span>
                  <span>·</span>
                  <span>❤ {featuredBlog._count.likes} likes</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Recent Articles Grid */}
      {otherBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
              <p className="text-gray-500 mt-1">Fresh content from our writers</p>
            </div>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/blogs">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherBlogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`}>
                <article className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-blue-200" />
                      </div>
                    )}
                    {blog.category && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {blog.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {blog.excerpt.replace(/<[^>]*>/g, "")}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {blog.author.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-500">{blog.author.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">❤ {blog._count.likes}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create
              <span className="text-blue-600"> great content</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Our AI-powered tools help you write better, faster and rank higher on search engines.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI Content Generation",
                desc: "Generate full articles, titles, and outlines with one click using advanced AI models",
                color: "from-blue-500 to-indigo-600",
                bg: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                icon: Search,
                title: "SEO Optimization",
                desc: "Auto-generate meta titles, descriptions, keywords and get your content ranking on Google",
                color: "from-purple-500 to-pink-600",
                bg: "bg-purple-50",
                iconColor: "text-purple-600",
              },
              {
                icon: Zap,
                title: "Content Enhancement",
                desc: "Improve readability, rewrite paragraphs, expand or summarize your content instantly",
                color: "from-orange-500 to-red-600",
                bg: "bg-orange-50",
                iconColor: "text-orange-600",
              },
            ].map(({ icon: Icon, title, desc, bg, iconColor }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-500 text-lg">Create your first AI-powered blog in 3 simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200" />
          {[
            {
              step: "01",
              title: "Sign Up Free",
              desc: "Create your account in seconds. No credit card required.",
              icon: Users,
            },
            {
              step: "02",
              title: "Generate Content",
              desc: "Enter your topic and let AI write your full blog post with SEO optimization.",
              icon: Sparkles,
            },
            {
              step: "03",
              title: "Publish & Rank",
              desc: "Publish your article and watch it climb the search engine rankings.",
              icon: TrendingUp,
            },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="text-center relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Icon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 ml-8 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                {step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by writers worldwide
            </h2>
            <p className="text-blue-100 text-lg">
              Join thousands of bloggers creating better content with AI
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Tech Blogger",
                review: "I went from spending 4 hours on a blog post to under 30 minutes. The AI suggestions are incredibly accurate.",
                rating: 5,
              },
              {
                name: "Marcus Chen",
                role: "Content Marketer",
                review: "The SEO optimization feature alone is worth it. My articles are ranking on the first page of Google now.",
                rating: 5,
              },
              {
                name: "Priya Patel",
                role: "Freelance Writer",
                review: "The best blogging platform I have used. Clean interface and the AI actually understands context.",
                rating: 5,
              },
            ].map(({ name, role, review, rating }) => (
              <div key={name} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white">
                <div className="flex mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-blue-100 mb-4 leading-relaxed">"{review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-blue-200 text-sm">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="bg-gradient-to-br from-gray-900 to-blue-950 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to write smarter?
            </h2>
            <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of writers using AI to create better content faster. Start for free today.
            </p>
            <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold text-base px-10 py-6 rounded-xl">
              <Link href="/sign-up">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-3">AI SEO Blog</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                The smartest way to create SEO-optimized blog content with AI assistance.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: ["Home", "Blogs", "Sign Up", "Sign In"],
                hrefs: ["/", "/blogs", "/sign-up", "/sign-in"],
              },
              {
                title: "Features",
                links: ["AI Writing", "SEO Tools", "Blog Editor", "Analytics"],
                hrefs: ["/sign-up", "/sign-up", "/sign-up", "/sign-up"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service"],
                hrefs: ["/", "/"],
              },
            ].map(({ title, links, hrefs }) => (
              <div key={title}>
                <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link, i) => (
                    <li key={link}>
                      <Link href={hrefs[i]} className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t pt-8 text-center text-gray-400 text-sm">
            © 2026 AI SEO Blog. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}