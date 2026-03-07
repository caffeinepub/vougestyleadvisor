import { useFadeIn } from "@/hooks/useFadeIn";
import { type FirebaseBlogPost, getPublishedBlogPosts } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface DisplayPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  author: string;
  publishDate: string;
}

const FALLBACK_POSTS: DisplayPost[] = [
  {
    id: "1",
    title: "5 Stylish Outfit Ideas for College",
    excerpt: "Discover trendy yet comfortable looks perfect for campus life.",
    category: "Casual Fashion",
    imageUrl: "/assets/generated/blog-college-outfits.dim_600x400.jpg",
    author: "Shagun Goyal",
    publishDate: "March 2026",
  },
  {
    id: "2",
    title: "How to Style a Black Dress",
    excerpt: "The little black dress reimagined — from office to evening.",
    category: "Styling Tips",
    imageUrl: "/assets/generated/blog-black-dress.dim_600x400.jpg",
    author: "Shagun Goyal",
    publishDate: "February 2026",
  },
  {
    id: "3",
    title: "Budget Fashion for Everyday Wear",
    excerpt: "Look expensive without breaking the bank with these smart tips.",
    category: "Budget Fashion",
    imageUrl: "/assets/generated/blog-budget-fashion.dim_600x400.jpg",
    author: "Shagun Goyal",
    publishDate: "February 2026",
  },
  {
    id: "4",
    title: "Elegant Winter Outfit Ideas",
    excerpt:
      "Stay warm and stylish this winter with layered looks you'll love.",
    category: "Seasonal Fashion",
    imageUrl: "/assets/generated/blog-winter-fashion.dim_600x400.jpg",
    author: "Shagun Goyal",
    publishDate: "January 2026",
  },
];

export default function FeaturedPosts() {
  const fadeRef = useFadeIn<HTMLElement>();
  const navigate = useNavigate();

  const { data: backendPosts } = useQuery<FirebaseBlogPost[]>({
    queryKey: ["publishedBlogPosts"],
    queryFn: getPublishedBlogPosts,
  });

  const displayPosts: DisplayPost[] =
    backendPosts && backendPosts.length > 0
      ? backendPosts.slice(0, 4).map((p) => ({
          id: p.id,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category,
          imageUrl: p.imageUrl,
          author: p.author,
          publishDate: new Date(p.publishDate).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          }),
        }))
      : FALLBACK_POSTS;

  return (
    <section
      id="fashion-ideas"
      data-ocid="featured_posts.section"
      ref={fadeRef}
      className="section-fade-in py-20 lg:py-28 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A86A] mb-3">
            Latest
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-[#111111] mb-4">
            Fashion Ideas
          </h2>
          <p className="font-sans text-sm text-gray-500 tracking-wide">
            Style inspiration for every occasion
          </p>
          <div className="w-12 h-px bg-[#C9A86A] mx-auto mt-6" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayPosts.map((post, idx) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: card click navigation
            <article
              key={post.id}
              data-ocid={`featured_posts.item.${idx + 1}`}
              onClick={() => navigate(`/blog/${post.id}`)}
              className="group bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
                  loading="lazy"
                />
                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-white font-sans text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 text-[#111111] shadow-sm">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-serif text-lg text-[#111111] leading-snug mb-2 group-hover:text-[#C9A86A] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="font-sans text-xs text-gray-500 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[10px] text-gray-400 tracking-wide">
                    {post.publishDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(`/blog/${post.id}`)}
                    className="font-sans text-xs text-[#C9A86A] tracking-wide hover:underline cursor-pointer font-medium"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
