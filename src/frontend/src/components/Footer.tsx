import { Instagram } from "lucide-react";
import { SiPinterest } from "react-icons/si";
import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "Fashion Ideas", to: "/blog" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl text-[#111111] tracking-widest uppercase mb-3">
              vougestyleadvisor
            </h3>
            <p className="font-sans text-xs text-gray-400 leading-relaxed max-w-xs">
              Styling Your Story, One Outfit at a Time.
            </p>
            <div className="w-10 h-px bg-[#C9A86A] mt-5" />
            <p className="font-sans text-xs text-gray-400 mt-5 leading-relaxed max-w-xs">
              A personal fashion brand and styling platform by Shagun Goyal.
              Fashion ideas, inspiration, and consultations curated with love.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-xs tracking-[0.25em] uppercase text-[#111111] mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-sans text-xs text-gray-400 hover:text-[#C9A86A] transition-colors duration-300 tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Social */}
          <div>
            <h4 className="font-sans text-xs tracking-[0.25em] uppercase text-[#111111] mb-5">
              Connect
            </h4>
            <p className="font-sans text-xs text-gray-400 leading-relaxed mb-6 max-w-xs">
              For brand collaborations, styling services, or fashion
              consultations, feel free to reach out.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/vougestyleadvisor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-400 hover:border-[#C9A86A] hover:text-[#C9A86A] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://pinterest.com/vougestyleadvisor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-400 hover:border-[#C9A86A] hover:text-[#C9A86A] transition-all duration-300"
                aria-label="Pinterest"
              >
                <SiPinterest size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[11px] text-gray-400 tracking-wide">
            © {currentYear} vougestyleadvisor by Shagun Goyal. All rights
            reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] text-gray-400 hover:text-[#C9A86A] transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
