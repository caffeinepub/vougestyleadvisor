import { type FirebaseBlogPost, getPublishedBlogPosts } from "@/lib/firebase";
import { SAMPLE_BLOG_POSTS } from "@/lib/sampleData";
import { useQuery } from "@tanstack/react-query";
import { Calendar, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  "All",
  "Casual Fashion",
  "Party Fashion",
  "Budget Fashion",
  "Seasonal Fashion",
  "Styling Tips",
];

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

function BlogCardSkeleton() {
  return (
    <div className="break-inside-avoid mb-6 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-8 bg-gray-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: posts, isLoading } = useQuery<FirebaseBlogPost[]>({
    queryKey: ["publishedBlogPosts"],
    queryFn: getPublishedBlogPosts,
  });

  const allPosts = posts && posts.length > 0 ? posts : SAMPLE_BLOG_POSTS;

  const filteredPosts =
    activeCategory === "All"
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <div className="bg-[#F5F1EB] pt-28 pb-16 px-6 lg:px-8 text-center">
        <p className="font-sans text-xs tracking-[0.35em] uppercase text-[#C9A86A] mb-3">
          The Edit
        </p>
        <h1 className="font-serif text-5xl lg:text-6xl text-[#111111] mb-4">
          Fashion Ideas
        </h1>
        <p className="font-sans text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
          Style inspiration, outfit ideas, and fashion advice for every occasion
          and every season.
        </p>
        <div className="w-12 h-px bg-[#C9A86A] mx-auto mt-6" />
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 lg:top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                data-ocid="blog.tab"
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap font-sans text-xs tracking-[0.12em] uppercase px-4 py-2 transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#111111] text-white"
                    : "text-gray-500 hover:text-[#111111] hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid — Pinterest masonry style */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div data-ocid="blog.empty_state" className="text-center py-24">
            <p className="font-serif text-2xl text-gray-400 mb-2">
              No posts found
            </p>
            <p className="font-sans text-sm text-gray-400">
              Try a different category
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {filteredPosts.map((post, idx) => (
              <article
                key={post.id}
                data-ocid={`blog.item.${idx + 1}`}
                className="break-inside-avoid mb-6 group bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Cover image */}
                <div className="relative overflow-hidden">
                  <img
                    src={
                      post.imageUrl ||
                      "/assets/generated/blog-college-outfits.dim_800x1000.jpg"
                    }
                    alt={post.title}
                    className="w-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    loading="lazy"
                    style={{ aspectRatio: "4/5" }}
                  />
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 bg-white/95 font-sans text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 text-[#111111] shadow-sm">
                    {post.category}
                  </span>
                </div>

                {/* Card content */}
                <div className="p-5">
                  <h2 className="font-serif text-lg leading-snug text-[#111111] mb-2 group-hover:text-[#C9A86A] transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5 font-sans text-[10px] tracking-wide">
                      <User size={11} />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1.5 font-sans text-[10px] tracking-wide">
                      <Calendar size={11} />
                      {formatDate(post.publishDate)}
                    </span>
                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    data-ocid={`blog.read_more_button.${idx + 1}`}
                    className="inline-block font-sans text-[10px] tracking-[0.18em] uppercase border border-[#111111] text-[#111111] px-5 py-2 hover:bg-[#111111] hover:text-white transition-all duration-300"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
