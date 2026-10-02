import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TankBanner } from "@/components/home/TankBanner";
import { StorySection } from "@/components/home/StorySection";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoryGrid />
      <FeaturedProducts />
      <TankBanner />
      <StorySection />
      <ReviewsCarousel />
      <FinalCTA />
    </>
  );
}
