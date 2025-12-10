import { buildPageMetadata } from "@/utils/seo";

const buildTitle = (brand) =>
  `${brand} Cars for Rent in Lahore | Convoy Travels`;

const buildDescription = (brand) =>
  `Book ${brand} sedans, SUVs, and luxury cars in Lahore with Convoy Travels. Compare prices, seats, and chauffeur options, then reserve instantly.`;

export async function generateMetadata({ params }) {
  const { brandName: rawBrand } = await params;
  const decodedBrand = decodeURIComponent(rawBrand || "").replace(/-/g, " ").trim();
  const normalizedBrand =
    decodedBrand.length > 0
      ? decodedBrand.charAt(0).toUpperCase() + decodedBrand.slice(1)
      : "Featured";

  return buildPageMetadata({
    title: buildTitle(normalizedBrand),
    description: buildDescription(normalizedBrand),
    path: `/brands/${encodeURIComponent(rawBrand)}`,
    keywords: [
      `${normalizedBrand} rent a car`,
      `${normalizedBrand} car hire Lahore`,
      "convoy travels brands",
      "luxury car rental lahore",
    ],
  });
}

export default function BrandLayout({ children }) {
  return <>{children}</>;
}

