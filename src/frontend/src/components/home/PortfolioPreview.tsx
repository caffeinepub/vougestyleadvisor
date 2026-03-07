import { useFadeIn } from "@/hooks/useFadeIn";
import {
  type FirebasePortfolioItem,
  getPublishedPortfolioItems,
} from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface DisplayItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

const FALLBACK_ITEMS: DisplayItem[] = [
  {
    id: "1",
    title: "Casual Street Style",
    description: "Urban vibes meet effortless elegance",
    imageUrl: "/assets/generated/portfolio-street-style.dim_600x400.jpg",
    category: "Casual Styling",
  },
  {
    id: "2",
    title: "Wedding Guest Styling",
    description: "Looking stunning at every celebration",
    imageUrl: "/assets/generated/portfolio-wedding-styling.dim_600x400.jpg",
    category: "Event Styling",
  },
  {
    id: "3",
    title: "Minimalist Fashion Looks",
    description: "Less is more — the art of minimalism",
    imageUrl: "/assets/generated/portfolio-minimalist.dim_600x400.jpg",
    category: "Minimalist Looks",
  },
  {
    id: "4",
    title: "Seasonal Fashion Trends",
    description: "Embracing every season with style",
    imageUrl: "/assets/generated/portfolio-seasonal.dim_600x400.jpg",
    category: "Seasonal Fashion",
  },
];

export default function PortfolioPreview() {
  const fadeRef = useFadeIn<HTMLElement>();
  const navigate = useNavigate();

  const { data: backendItems } = useQuery<FirebasePortfolioItem[]>({
    queryKey: ["publishedPortfolioItems"],
    queryFn: getPublishedPortfolioItems,
  });

  const displayItems: DisplayItem[] =
    backendItems && backendItems.length > 0
      ? backendItems.slice(0, 4).map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          category: item.category,
        }))
      : FALLBACK_ITEMS;

  const handleViewPortfolio = () => {
    navigate("/portfolio");
  };

  return (
    <section
      id="portfolio"
      data-ocid="portfolio_preview.section"
      ref={fadeRef}
      className="section-fade-in py-20 lg:py-28 bg-[#F5F1EB]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A86A] mb-3">
            My Work
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-[#111111] mb-4">
            Portfolio
          </h2>
          <p className="font-sans text-sm text-gray-500 tracking-wide">
            A glimpse into my styling world
          </p>
          <div className="w-12 h-px bg-[#C9A86A] mx-auto mt-6" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayItems.map((item, idx) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: card click navigation
            <div
              key={item.id}
              data-ocid={`portfolio_preview.item.${idx + 1}`}
              onClick={() => navigate(`/portfolio/${item.id}`)}
              className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
                loading="lazy"
              />
              {/* Category label top */}
              <span className="absolute top-3 left-3 bg-white/90 font-sans text-[10px] tracking-[0.12em] uppercase px-2 py-1 text-[#111111]">
                {item.category}
              </span>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-[#111111]/0 group-hover:bg-[#111111]/60 transition-all duration-400 flex items-end">
                <div className="p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                  <h3 className="font-serif text-xl text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-white/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            type="button"
            data-ocid="portfolio_preview.button"
            onClick={handleViewPortfolio}
            className="font-sans text-xs tracking-[0.18em] uppercase border border-[#111111] text-[#111111] px-10 py-3.5 hover:bg-[#111111] hover:text-white transition-all duration-300 hover:scale-[1.02]"
          >
            View Full Portfolio
          </button>
        </div>
      </div>
    </section>
  );
}
