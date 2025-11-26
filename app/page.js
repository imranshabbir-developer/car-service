import HeroSection from "@/components/HeroSection";
import TrustedClients from "@/components/TrustedClients";
import PerfectDriver from "@/components/PerfectDriver";
import FeaturedCarsSection from "@/components/FeaturedCarsSection";
import RentCarInfoSection from "@/components/RentCarInfoSection";
import AffordableRentCarSection from "@/components/AffordableRentCarSection";
import OnlineCarBooking from "@/components/OnlineCarBooking";
import AffordableCarRental from "@/components/AffordableCarRental";
import AffordableCarRentalWithDriver from "@/components/AffordableCarRentalWithDriver";
import PopularBrands from "@/components/PopularBrands";
// import BlogSection from "@/components/BlogSection";
import ReviewsSection from "@/components/ReviewsSection";
import CompactHero from "@/components/CompactHero";
import FAQSection from "@/components/FAQSection";
import LocationMap from "@/components/LocationMap";
import MobileContactBar from "@/components/MobileContactBar";
import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Rent a Car in Lahore With & Without Driver | 2025 Best Prices",
  description:
    "Rent a Car in Lahore With Driver & Without Driver with Convoy Travels, offering transparent pricing & rates. Best rent a car service for all your travel needs in Lahore.",
  path: "/",
  keywords: [
    "rent a car Lahore",
    "convoy travels",
    "self drive car rental",
    "chauffeur service lahore",
    "wedding car rental",
    "airport transfer lahore",
  ],
});

export default function Home() {
  return (
    <main className="relative pb-16 md:pb-0">
      <HeroSection />
      <TrustedClients />
      <PerfectDriver />
      <FeaturedCarsSection />
      <RentCarInfoSection /> 
      <AffordableRentCarSection />
      <OnlineCarBooking />
      <AffordableCarRental />
      <AffordableCarRentalWithDriver />
      <PopularBrands />
      {/* <BlogSection /> */}
      <ReviewsSection />
      <CompactHero />
      <FAQSection />
      <LocationMap />
      <MobileContactBar />
    </main>
  );
}

