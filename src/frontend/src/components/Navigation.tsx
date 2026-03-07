import { Instagram, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Fashion Ideas", to: "/blog" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              type="button"
              onClick={handleLogoClick}
              className="font-serif text-lg lg:text-xl tracking-widest text-[#111111] font-medium hover:text-[#C9A86A] transition-colors duration-300 uppercase"
            >
              vougestyleadvisor
            </button>

            {/* Desktop Nav Links */}
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    data-ocid={`nav.link.${i + 1}`}
                    className="font-sans text-xs uppercase tracking-[0.15em] text-[#111111] hover:text-[#C9A86A] transition-colors duration-300 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right icons */}
            <div className="hidden lg:flex items-center gap-5">
              <a
                href="https://instagram.com/vougestyleadvisor"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="nav.instagram_button"
                className="text-[#111111] hover:text-[#C9A86A] transition-colors duration-300"
                aria-label="Follow on Instagram"
              >
                <Instagram size={18} />
              </a>
              <button
                type="button"
                data-ocid="nav.search_button"
                className="text-[#111111] hover:text-[#C9A86A] transition-colors duration-300"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <Link
                to="/admin"
                data-ocid="nav.admin_link"
                className="font-sans text-[10px] tracking-[0.1em] text-gray-300 hover:text-gray-500 transition-colors duration-300 uppercase"
              >
                Admin
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden text-[#111111] hover:text-[#C9A86A] transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click to close */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col pt-20 px-8">
            <ul className="flex flex-col gap-6 mt-4">
              {navLinks.map((link, i) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    data-ocid={`nav.link.${i + 1}`}
                    onClick={() => setMobileOpen(false)}
                    className="font-sans text-sm uppercase tracking-[0.15em] text-[#111111] hover:text-[#C9A86A] transition-colors duration-300 font-medium text-left"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/admin"
                  data-ocid="nav.admin_link"
                  onClick={() => setMobileOpen(false)}
                  className="font-sans text-xs tracking-[0.1em] text-gray-300 hover:text-gray-500 transition-colors uppercase"
                >
                  Admin
                </Link>
              </li>
            </ul>
            <div className="flex items-center gap-5 mt-10 pt-8 border-t border-gray-100">
              <a
                href="https://instagram.com/vougestyleadvisor"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="nav.instagram_button"
                className="text-[#111111] hover:text-[#C9A86A] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <button
                type="button"
                data-ocid="nav.search_button"
                className="text-[#111111] hover:text-[#C9A86A] transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
