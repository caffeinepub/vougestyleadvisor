import { useFadeIn } from "@/hooks/useFadeIn";
import {
  BookOpen,
  Heart,
  Palette,
  Shirt,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const SKILLS = [
  { name: "Fashion Styling", level: 95 },
  { name: "Outfit Planning", level: 92 },
  { name: "Trend Analysis", level: 88 },
  { name: "Personal Fashion Advice", level: 96 },
  { name: "Color Theory", level: 85 },
  { name: "Wardrobe Curation", level: 90 },
];

const PHILOSOPHY = [
  {
    icon: Heart,
    title: "Confidence Through Clothing",
    desc: "Fashion is not about following trends — it's about wearing what makes you feel powerful, beautiful, and authentically yourself.",
  },
  {
    icon: Sparkles,
    title: "Affordable Fashion for All",
    desc: "Style should be accessible to everyone. I believe in looking your best without breaking the bank, through smart choices and creative styling.",
  },
  {
    icon: Target,
    title: "Your Personal Style Journey",
    desc: "Every person has a unique style waiting to be discovered. My role is to help you find it, refine it, and express it with confidence.",
  },
];

export default function AboutPage() {
  const introRef = useFadeIn<HTMLDivElement>();
  const philosophyRef = useFadeIn<HTMLDivElement>();
  const skillsRef = useFadeIn<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-white">
      {/* Intro Section */}
      <section className="pt-24 pb-0">
        <div
          ref={introRef}
          className="section-fade-in max-w-7xl mx-auto px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[80vh]">
            {/* Left — Photo */}
            <div className="relative overflow-hidden bg-[#F5F1EB] order-2 lg:order-1">
              <img
                src="https://res.cloudinary.com/doj0aeuvi/image/upload/v1772909443/1000041676_pg44ww.jpg"
                alt="Shagun Goyal — Fashion Stylist"
                className="w-full h-full object-cover object-top"
                style={{ minHeight: "500px", maxHeight: "700px" }}
              />
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm px-5 py-4 max-w-[220px]">
                <p className="font-serif text-sm text-[#111111] leading-snug">
                  "Style is a way to say who you are without speaking."
                </p>
                <div className="w-8 h-px bg-[#C9A86A] mt-2" />
              </div>
            </div>

            {/* Right — Bio */}
            <div className="flex flex-col justify-center px-0 lg:px-16 py-16 order-1 lg:order-2 bg-white">
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-[#C9A86A] mb-4">
                About Me
              </p>
              <h1 className="font-serif text-4xl lg:text-5xl text-[#111111] leading-tight mb-6">
                Shagun Goyal
              </h1>
              <div className="w-10 h-px bg-[#C9A86A] mb-8" />
              <p className="font-sans text-sm text-gray-600 leading-loose mb-6">
                Shagun Goyal is a passionate fashion stylist and personal brand
                consultant based in India. She loves helping people discover
                their unique style and express themselves through clothing and
                creative outfit ideas.
              </p>
              <p className="font-sans text-sm text-gray-600 leading-loose mb-8">
                With a deep love for fashion and an eye for detail, she creates
                looks that are both beautiful and uniquely personal — whether
                it's everyday casual styling, event looks, or complete wardrobe
                transformations.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                {[
                  { icon: Users, label: "Happy Clients", value: "500+" },
                  { icon: Shirt, label: "Outfits Styled", value: "1200+" },
                  { icon: BookOpen, label: "Blog Posts", value: "50+" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <stat.icon
                      size={18}
                      className="text-[#C9A86A] mx-auto mb-1"
                    />
                    <p className="font-serif text-2xl text-[#111111]">
                      {stat.value}
                    </p>
                    <p className="font-sans text-[10px] text-gray-400 tracking-wide uppercase mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fashion Philosophy */}
      <section className="py-20 lg:py-28 bg-[#F5F1EB]">
        <div
          ref={philosophyRef}
          className="section-fade-in max-w-7xl mx-auto px-6 lg:px-8"
        >
          <div className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A86A] mb-3">
              My Approach
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl text-[#111111] mb-4">
              Fashion Philosophy
            </h2>
            <div className="w-12 h-px bg-[#C9A86A] mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PHILOSOPHY.map((item) => (
              <div
                key={item.title}
                className="bg-white p-8 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 flex items-center justify-center border border-[#C9A86A]/25 mb-6 group-hover:bg-[#C9A86A]/10 transition-colors">
                  <item.icon size={22} className="text-[#C9A86A]" />
                </div>
                <h3 className="font-serif text-xl text-[#111111] mb-3">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-gray-500 leading-loose">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 lg:py-28 bg-white">
        <div
          ref={skillsRef}
          className="section-fade-in max-w-3xl mx-auto px-6 lg:px-8"
        >
          <div className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C9A86A] mb-3">
              Expertise
            </p>
            <h2 className="font-serif text-4xl text-[#111111] mb-4">Skills</h2>
            <div className="w-12 h-px bg-[#C9A86A] mx-auto mt-5" />
          </div>

          <div className="space-y-6">
            {SKILLS.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-sm text-[#111111] tracking-wide">
                    {skill.name}
                  </span>
                  <span className="font-sans text-xs text-[#C9A86A]">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full bg-[#F5F1EB] h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#C9A86A] transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skill tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-10 border-t border-gray-100">
            {[
              "Fashion Blogger",
              "Outfit Curator",
              "Style Consultant",
              "Brand Collaborator",
              "Content Creator",
              "Wardrobe Architect",
            ].map((tag) => (
              <span
                key={tag}
                className="font-sans text-[10px] tracking-[0.12em] uppercase bg-[#F5F1EB] text-gray-600 px-4 py-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#111111] text-center px-6">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-16 h-px bg-[#C9A86A]/30" />
          <TrendingUp size={16} className="text-[#C9A86A]" />
          <div className="w-16 h-px bg-[#C9A86A]/30" />
        </div>
        <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
          Ready to Transform Your Style?
        </h2>
        <p className="font-sans text-sm text-white/55 mb-8 max-w-md mx-auto leading-relaxed">
          Let's work together to discover and elevate your personal style. Book
          a consultation today.
        </p>
        <Link
          to="/services"
          data-ocid="about.cta_button"
          className="inline-block font-sans text-xs tracking-[0.18em] uppercase bg-[#C9A86A] text-white px-10 py-4 hover:bg-[#b8945a] transition-all duration-300 hover:scale-[1.02]"
        >
          View Services
        </Link>
      </section>
    </div>
  );
}
