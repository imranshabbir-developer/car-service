import { buildPageMetadata } from "@/utils/seo";
import { isObjectId } from "@/utils/slug";

const formatCarName = (value) => {
  if (!value) return "Premium Vehicle";
  if (isObjectId(value)) {
    return "Premium Vehicle";
  }

  const cleaned = value.replace(/-/g, " ").replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return "Premium Vehicle";
  }

  return cleaned
    .split(" ")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

export async function generateMetadata({ params }) {
  const rawParam = params.id || "";
  const decodedParam = decodeURIComponent(rawParam);
  const carName = formatCarName(decodedParam);
  const canonicalPath = rawParam ? `/cars/${rawParam}` : "/cars";

  return buildPageMetadata({
    title: `${carName} Rental in Lahore | Convoy Travels`,
    description: `Reserve ${carName} with Convoy Travels for business trips, weddings, and airport transfers across Lahore with vetted chauffeurs and 24/7 support.`,
    path: canonicalPath,
    keywords: [
      `${carName} rent a car`,
      "convoy travels fleet",
      "chauffeur car hire lahore",
      "self drive car lahore",
    ],
    type: "product",
  });
}

export default function CarDetailLayout({ children }) {
  return <>{children}</>;
}

