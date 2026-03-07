import {
  type FirebasePortfolioItem,
  getPortfolioItemById,
} from "@/lib/firebase";
import { SAMPLE_PORTFOLIO_ITEMS } from "@/lib/sampleData";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lightbulb, Scissors } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: item, isLoading } = useQuery<FirebasePortfolioItem | null>({
    queryKey: ["portfolioItem", id],
    queryFn: async () => {
      if (!id) return null;
      return getPortfolioItemById(id);
    },
    enabled: !!id,
  });

  const displayItem =
    item ?? SAMPLE_PORTFOLIO_ITEMS.find((p) => p.id === id) ?? null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-gray-200" />
            <div className="space-y-6 pt-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-10 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-4 bg-gray-100 rounded w-4/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!displayItem) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-24">
        <p className="font-serif text-3xl text-gray-300 mb-4">Item not found</p>
        <Link
          to="/portfolio"
          className="font-sans text-xs tracking-[0.15em] uppercase border border-[#111111] text-[#111111] px-6 py-3 hover:bg-[#111111] hover:text-white transition-all duration-300"
        >
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-gray-400 font-sans text-xs tracking-wide mb-10">
          <Link to="/" className="hover:text-[#C9A86A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/portfolio"
            className="hover:text-[#C9A86A] transition-colors"
          >
            Portfolio
          </Link>
          <span>/</span>
          <span className="text-[#111111] line-clamp-1">
            {displayItem.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
          {/* Large Image */}
          <div className="relative overflow-hidden">
            <img
              src={
                displayItem.imageUrl ||
                "/assets/generated/portfolio-casual-street.dim_900x1100.jpg"
              }
              alt={displayItem.title}
              className="w-full h-full object-cover"
              style={{ maxHeight: "680px" }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            {/* Category badge */}
            <span className="inline-block bg-[#F5F1EB] font-sans text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 text-[#C9A86A] mb-5 self-start">
              {displayItem.category}
            </span>

            <h1 className="font-serif text-4xl lg:text-5xl text-[#111111] leading-tight mb-6">
              {displayItem.title}
            </h1>

            <div className="w-10 h-px bg-[#C9A86A] mb-6" />

            <p className="font-sans text-sm text-gray-600 leading-loose mb-10">
              {displayItem.description}
            </p>

            {/* Styling Explanation */}
            <div className="bg-[#F5F1EB] p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Scissors size={15} className="text-[#C9A86A]" />
                <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-[#111111] font-medium">
                  Styling Explanation
                </h3>
              </div>
              <p className="font-sans text-sm text-gray-600 leading-loose">
                {displayItem.stylingExplanation}
              </p>
            </div>

            {/* Fashion Tips */}
            <div className="bg-white border border-[#C9A86A]/25 p-6 mb-10">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={15} className="text-[#C9A86A]" />
                <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-[#111111] font-medium">
                  Fashion Tips
                </h3>
              </div>
              <p className="font-sans text-sm text-gray-600 leading-loose">
                {displayItem.fashionTips}
              </p>
            </div>

            {/* Back button */}
            <Link
              to="/portfolio"
              data-ocid="portfolio_detail.back_button"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-gray-500 hover:text-[#111111] transition-colors duration-300 self-start"
            >
              <ArrowLeft size={14} />
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
