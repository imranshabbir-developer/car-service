import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Contact Convoy Travels | Book a Car Rental in Lahore",
  description:
    "Reach Convoy Travels for 24/7 car rental assistance, chauffeur bookings, pricing questions, and fleet availability across Lahore and Punjab.",
  path: "/contact",
  keywords: [
    "contact convoy travels",
    "rent a car support lahore",
    "convoy travels phone number",
    "car rental helpline lahore",
  ],
});

export default function ContactLayout({ children }) {
  return <>{children}</>;
}

