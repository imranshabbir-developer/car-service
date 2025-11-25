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
  title: "Convoy Travels | Rent a Car in Lahore with or without Driver",
  description:
    "Hire economy, business, and luxury cars in Lahore with Convoy Travels. Flexible chauffeur options, transparent pricing, and 24/7 booking support across Pakistan.",
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

