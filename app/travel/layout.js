import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Plan Custom Tours Across Pakistan | Convoy Travels",
  description:
    "Design bespoke northern Pakistan trips with Convoy Travels. Get curated itineraries, chauffeured vehicles, and photo-ready stops for families and corporates.",
  path: "/travel",
  keywords: [
    "northern areas tour",
    "custom pakistan trip",
    "travel planner lahore",
    "convoy travels packages",
  ],
});

export default function TravelLayout({ children }) {
  return <>{children}</>;
}

