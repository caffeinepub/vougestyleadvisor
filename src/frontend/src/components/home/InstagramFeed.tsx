import { useFadeIn } from "@/hooks/useFadeIn";
import { Heart, Instagram } from "lucide-react";

const INSTAGRAM_IMAGES = [
  {
    id: "1",
    src: "/assets/generated/blog-college-outfits.dim_600x400.jpg",
    alt: "College outfit ideas",
  },
  {
    id: "2",
    src: "/assets/generated/portfolio-street-style.dim_600x400.jpg",
    alt: "Street style look",
  },
  {
    id: "3",
    src: "/assets/generated/blog-black-dress.dim_600x400.jpg",
    alt: "Black dress styling",
  },
  {
    id: "4",
    src: "/assets/generated/portfolio-wedding-styling.dim_600x400.jpg",
    alt: "Wedding guest outfit",
  },
  {
    id: "5",
    src: "/assets/generated/portfolio-minimalist.dim_600x400.jpg",
    alt: "Minimalist fashion",
  },
  {
    id: "6",
    src: "/assets/generated/blog-winter-fashion.dim_600x400.jpg",
    alt: "Winter fashion ideas",
  },
];

export default function InstagramFeed() {
  const fadeRef = useFadeIn<HTMLElement>();

  return (
    <section
      id="instagram"
      data-ocid="instagram.section"
      ref={fadeRef}
      className="section-fade-in py-20 lg:py-28 bg-[#F5F1EB]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram size={18} className="text-[#C9A86A]" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A86A]">
              Instagram
            </p>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl text-[#111111]">
            Follow My Fashion Journey on Instagram
          </h2>
          <div className="w-12 h-px bg-[#C9A86A] mx-auto mt-6" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
          {INSTAGRAM_IMAGES.map((img) => (
            <a
              key={img.id}
              href="https://instagram.com/vougestyleadvisor"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden block"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#111111]/0 group-hover:bg-[#111111]/45 transition-all duration-300 flex items-center justify-center">
                <Heart
                  size={24}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 fill-white"
                />
              </div>
            </a>
          ))}
        </div>

        {/* Follow Button */}
        <div className="text-center mt-10">
          <a
            href="https://instagram.com/vougestyleadvisor"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="instagram.follow_button"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.18em] uppercase border border-[#111111] text-[#111111] px-8 py-3.5 hover:bg-[#111111] hover:text-white transition-all duration-300"
          >
            <Instagram size={14} />
            Follow @vougestyleadvisor
          </a>
        </div>
      </div>
    </section>
  );
}
