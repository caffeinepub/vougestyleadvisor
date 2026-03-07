import { type FirebaseBlogPost, getBlogPostById } from "@/lib/firebase";
import { SAMPLE_BLOG_POSTS } from "@/lib/sampleData";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Copy, Share2, Twitter, User } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function formatDate(publishDate: number | bigint): string {
  try {
    const ms =
      typeof publishDate === "bigint"
        ? Number(publishDate) / 1_000_000
        : publishDate;
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Recent";
  }
}

function renderContent(content: string) {
  const sections = content.split(/\n\n+/);
  return sections.map((section, i) => {
    if (section.startsWith("## ")) {
      return (
        <h2
          // biome-ignore lint/suspicious/noArrayIndexKey: content sections
          key={i}
          className="font-serif text-2xl text-[#111111] mt-10 mb-4"
        >
          {section.replace("## ", "")}
        </h2>
      );
    }
    if (section.startsWith("### ")) {
      return (
        <h3
          // biome-ignore lint/suspicious/noArrayIndexKey: content sections
          key={i}
          className="font-serif text-xl text-[#111111] mt-8 mb-3"
        >
          {section.replace("### ", "")}
        </h3>
      );
    }
    // Ordered/unordered list items
    const lines = section.split("\n");
    const isListBlock = lines.every(
      (l) => l.match(/^(\d+\.\s|-\s|\*\s)/) || l.trim() === "",
    );
    if (isListBlock && lines.some((l) => l.match(/^(\d+\.\s|-\s|\*\s)/))) {
      return (
        <ul
          // biome-ignore lint/suspicious/noArrayIndexKey: content sections
          key={i}
          className="list-none space-y-2 mb-4"
        >
          {lines
            .filter((l) => l.trim())
            .map((line, j) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: list items from parsed content
                key={j}
                className="font-sans text-sm text-gray-600 leading-relaxed pl-4 border-l-2 border-[#C9A86A]/40"
              >
                {line.replace(/^(\d+\.\s|-\s|\*\s)/, "")}
              </li>
            ))}
        </ul>
      );
    }
    return (
      <p
        // biome-ignore lint/suspicious/noArrayIndexKey: content sections
        key={i}
        className="font-sans text-sm text-gray-600 leading-loose mb-4"
      >
        {section}
      </p>
    );
  });
}

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const { data: post, isLoading } = useQuery<FirebaseBlogPost | null>({
    queryKey: ["blogPost", id],
    queryFn: async () => {
      if (!id) return null;
      return getBlogPostById(id);
    },
    enabled: !!id,
  });

  // Fall back to sample data if post not found in Firebase yet
  const sampleFallback = SAMPLE_BLOG_POSTS.find((p) => p.id === id);
  const displayPost =
    post ??
    (sampleFallback
      ? {
          ...sampleFallback,
          publishDate: Number(sampleFallback.publishDate) / 1_000_000,
        }
      : null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(
      `${displayPost?.title} - by Shagun Goyal on vougestyleadvisor`,
    );
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
    );
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Check out this fashion article: ${displayPost?.title} ${window.location.href}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 animate-pulse">
          <div className="w-full h-72 bg-gray-200 mb-8" />
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <div key={i} className="h-4 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!displayPost) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-24">
        <p className="font-serif text-3xl text-gray-300 mb-4">Post not found</p>
        <Link
          to="/blog"
          className="font-sans text-xs tracking-[0.15em] uppercase border border-[#111111] text-[#111111] px-6 py-3 hover:bg-[#111111] hover:text-white transition-all duration-300"
        >
          Back to Fashion Ideas
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cover Image */}
      <div
        className="relative w-full"
        style={{ maxHeight: "500px", overflow: "hidden" }}
      >
        <img
          src={
            displayPost.imageUrl ||
            "/assets/generated/blog-college-outfits.dim_800x1000.jpg"
          }
          alt={displayPost.title}
          className="w-full object-cover object-center"
          style={{ maxHeight: "500px", width: "100%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Article */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-gray-400 font-sans text-xs tracking-wide mb-8">
          <Link to="/" className="hover:text-[#C9A86A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#C9A86A] transition-colors">
            Fashion Ideas
          </Link>
          <span>/</span>
          <span className="text-[#111111] line-clamp-1">
            {displayPost.title}
          </span>
        </nav>

        {/* Category badge */}
        <span className="inline-block bg-[#F5F1EB] font-sans text-[9px] tracking-[0.2em] uppercase px-3 py-1 text-[#C9A86A] mb-4">
          {displayPost.category}
        </span>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#111111] leading-tight mb-6">
          {displayPost.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-5 text-gray-400 mb-8 pb-8 border-b border-gray-100">
          <span className="flex items-center gap-2 font-sans text-xs tracking-wide">
            <User size={13} />
            {displayPost.author}
          </span>
          <span className="flex items-center gap-2 font-sans text-xs tracking-wide">
            <Calendar size={13} />
            {formatDate(displayPost.publishDate)}
          </span>
        </div>

        {/* Article Content */}
        <div className="prose-fashion">
          {renderContent(displayPost.content)}
        </div>

        {/* Inline article image (mid-article visual break) */}
        <div className="my-10 overflow-hidden">
          <img
            src={
              displayPost.imageUrl ||
              "/assets/generated/blog-college-outfits.dim_800x1000.jpg"
            }
            alt={`${displayPost.title} - styling details`}
            className="w-full object-cover"
            style={{ maxHeight: "360px" }}
            loading="lazy"
          />
          <p className="font-sans text-[10px] text-gray-400 mt-2 text-center tracking-wide italic">
            Styling by Shagun Goyal — vougestyleadvisor
          </p>
        </div>

        {/* Tags */}
        {displayPost.tags && displayPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
            {displayPost.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#F5F1EB] font-sans text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 text-gray-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Social Share */}
        <div className="flex items-center gap-3 mt-10 pt-8 border-t border-gray-100">
          <span className="font-sans text-xs tracking-[0.15em] uppercase text-gray-400 flex items-center gap-2">
            <Share2 size={13} />
            Share
          </span>
          <button
            type="button"
            data-ocid="blog_post.share_button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 font-sans text-xs tracking-wide border border-gray-200 px-4 py-2 hover:border-[#C9A86A] hover:text-[#C9A86A] transition-all duration-300"
          >
            <Copy size={12} />
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 font-sans text-xs tracking-wide border border-gray-200 px-4 py-2 hover:border-green-500 hover:text-green-500 transition-all duration-300"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={handleTwitterShare}
            className="flex items-center gap-2 font-sans text-xs tracking-wide border border-gray-200 px-4 py-2 hover:border-[#111111] hover:text-[#111111] transition-all duration-300"
          >
            <Twitter size={12} />X
          </button>
        </div>

        {/* Back button */}
        <div className="mt-12">
          <Link
            to="/blog"
            data-ocid="blog_post.back_button"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-gray-500 hover:text-[#111111] transition-colors duration-300"
          >
            <ArrowLeft size={14} />
            Back to Fashion Ideas
          </Link>
        </div>
      </div>
    </div>
  );
}
