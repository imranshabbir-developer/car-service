import { buildPageMetadata } from "@/utils/seo";
import { isObjectId } from "@/utils/slug";

const formatBlogTitle = (slug) => {
  if (!slug) return "Convoy Travels Blog";
  if (isObjectId(slug)) {
    return "Convoy Travels Blog";
  }

  const cleaned = slug.replace(/-/g, " ").replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return "Convoy Travels Blog";
  }

  return cleaned
    .split(" ")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

export async function generateMetadata({ params }) {
  const rawSlug = params.slug;
  const decodedSlug = decodeURIComponent(rawSlug || "");
  const blogTitle = formatBlogTitle(decodedSlug);
  const canonicalPath = rawSlug ? `/main-blog/${rawSlug}` : "/main-blogs";

  return buildPageMetadata({
    title: `${blogTitle} | Convoy Travels Blog`,
    description:
      "Read curated travel inspiration, rental advice, and Convoy Travels service updates to plan reliable journeys across Pakistan.",
    path: canonicalPath,
    keywords: [
      blogTitle,
      "convoy travels blog",
      "travel tips pakistan",
      "rent a car stories",
    ],
    type: "article",
  });
}

export default function MainBlogDetailLayout({ children }) {
  return <>{children}</>;
}

