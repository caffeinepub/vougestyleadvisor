import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import AboutPage from "@/pages/AboutPage";
import AdminPage from "@/pages/AdminPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import ContactPage from "@/pages/ContactPage";
import HomePage from "@/pages/HomePage";
import PortfolioDetailPage from "@/pages/PortfolioDetailPage";
import PortfolioPage from "@/pages/PortfolioPage";
import ServicesPage from "@/pages/ServicesPage";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white">
      {!isAdmin && <Navigation />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>

      {!isAdmin && <Footer />}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
