import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Car Rental Fleet in Lahore | Browse & Book with Convoy Travels",
  description:
    "Compare over 50 chauffeur and self-drive cars in Lahore by brand, category, or budget. Instant quotes, serial ordering, and transparent daily pricing.",
  path: "/cars",
  keywords: [
    "car rental fleet lahore",
    "book car convoy travels",
    "self drive car lahore",
    "chauffeur car hire pakistan",
  ],
});

export default function CarsLayout({ children }) {
  return <>{children}</>;
}

