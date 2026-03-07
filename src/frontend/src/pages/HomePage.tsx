import FeaturedPosts from "@/components/home/FeaturedPosts";
import HeroSection from "@/components/home/HeroSection";
import InstagramFeed from "@/components/home/InstagramFeed";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import ServicesHighlight from "@/components/home/ServicesHighlight";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedPosts />
      <PortfolioPreview />
      <ServicesHighlight />
      <InstagramFeed />
    </main>
  );
}
