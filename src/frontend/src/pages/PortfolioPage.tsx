import {
  type FirebasePortfolioItem,
  getPublishedPortfolioItems,
} from "@/lib/firebase";
import { SAMPLE_PORTFOLIO_ITEMS } from "@/lib/sampleData";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  "All",
  "Casual Styling",
  "Event Styling",
  "Minimalist Looks",
  "Seasonal Fashion",
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: items, isLoading } = useQuery<FirebasePortfolioItem[]>({
    queryKey: ["publishedPortfolioItems"],
    queryFn: getPublishedPortfolioItems,
  });

  const allItems = items && items.length > 0 ? items : SAMPLE_PORTFOLIO_ITEMS;

  const filteredItems =
    activeCategory === "All"
      ? allItems
      : allItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Hero */}
      <div className="bg-[#111111] pt-28 pb-16 px-6 lg:px-8 text-center relative overflow-hidden">
        {/* subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative z-10">
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-[#C9A86A] mb-3">
            My Work
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-4">
            Portfolio
          </h1>
          <p className="font-sans text-sm text-white/55 max-w-lg mx-auto leading-relaxed">
            A curated showcase of fashion styling work — from everyday elegance
            to special occasions.
          </p>
          <div className="w-12 h-px bg-[#C9A86A] mx-auto mt-6" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 lg:top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                data-ocid="portfolio.tab"
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

      {/* Portfolio Grid */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div data-ocid="portfolio.empty_state" className="text-center py-24">
            <p className="font-serif text-2xl text-gray-400 mb-2">
              No items found
            </p>
            <p className="font-sans text-sm text-gray-400">
              Try a different category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <Link
                key={item.id}
                to={`/portfolio/${item.id}`}
                data-ocid={`portfolio.item.${idx + 1}`}
                className="group relative aspect-[3/4] overflow-hidden block bg-gray-100"
              >
                <img
                  src={
                    item.imageUrl ||
                    "/assets/generated/portfolio-casual-street.dim_900x1100.jpg"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-600"
                  loading="lazy"
                />

                {/* Category badge */}
                <span className="absolute top-4 left-4 bg-white/90 font-sans text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 text-[#111111] shadow-sm z-10">
                  {item.category}
                </span>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#111111]/0 group-hover:bg-[#111111]/70 transition-all duration-400 flex flex-col items-center justify-center p-6">
                  <div className="translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 text-center">
                    <Eye size={20} className="text-white mx-auto mb-3" />
                    <h3 className="font-serif text-xl text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs text-white/75 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-4 inline-block border border-white/50 font-sans text-[9px] tracking-[0.2em] uppercase text-white px-4 py-2">
                      View Details
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
