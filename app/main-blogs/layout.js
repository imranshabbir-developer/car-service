import { buildPageMetadata } from "@/utils/seo";

export const metadata = buildPageMetadata({
  title: "Convoy Travels Blog | Tips, Guides & Rental Stories",
  description:
    "Read curated travel guides, fleet highlights, and customer stories from Convoy Travels to plan better road trips and chauffeured experiences in Pakistan.",
  path: "/main-blogs",
  keywords: [
    "convoy travels blog",
    "travel tips pakistan",
    "rent a car stories",
    "lahore travel guide",
  ],
});

export default function MainBlogsLayout({ children }) {
  return <>{children}</>;
}

