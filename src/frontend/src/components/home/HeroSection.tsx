import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/blog");
  };

  const handleServices = () => {
    navigate("/services");
  };

  const handleScrollDown = () => {
    navigate("/blog");
  };

  return (
    <section
      id="home"
      data-ocid="hero.section"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-fashion.dim_1600x900.jpg')",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Label */}
        <p
          className="font-sans text-xs tracking-[0.35em] uppercase mb-6 animate-fade-in"
          style={{
            color: "#C9A86A",
            animationDelay: "0.2s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          Fashion &bull; Style &bull; Elegance
        </p>

        {/* Main Headline */}
        <h1
          className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.15] mb-6 animate-fade-in-up"
          style={{
            animationDelay: "0.4s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          "Style Is a Way to Say <br className="hidden md:block" />
          <em>Who You Are</em> Without Speaking."
        </h1>

        {/* Subheading */}
        <p
          className="font-sans text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-10 font-light animate-fade-in-up"
          style={{
            animationDelay: "0.65s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          Fashion ideas, styling inspiration, and personal fashion consultation
          by Shagun Goyal.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{
            animationDelay: "0.85s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <button
            type="button"
            data-ocid="hero.primary_button"
            onClick={handleExplore}
            className="bg-white text-[#111111] font-sans text-sm tracking-[0.12em] uppercase font-medium px-8 py-3.5 hover:bg-[#F5F1EB] transition-all duration-300 hover:scale-[1.02] min-w-[200px]"
          >
            Explore Fashion Ideas
          </button>
          <button
            type="button"
            data-ocid="hero.secondary_button"
            onClick={handleServices}
            className="border border-white text-white font-sans text-sm tracking-[0.12em] uppercase font-medium px-8 py-3.5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] min-w-[200px]"
          >
            View Services
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors duration-300 animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
