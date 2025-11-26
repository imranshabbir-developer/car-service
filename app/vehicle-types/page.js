import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import VehicleTypesContent from './VehicleTypesContent';
import { buildPageMetadata } from '@/utils/seo';
import { buildDynamicMetadata, extractSeoData } from '@/utils/dynamicSeo';
import { API_BASE_URL } from '@/config/api';

const DEFAULT_META = {
  title: 'Vehicle Categories | Chauffeur & Self-Drive Cars in Lahore',
  description:
    'Browse economy, business, luxury, SUV, and van categories from Convoy Travels to match your trip, wedding, corporate visit, or airport transfer.',
  keywords: [
    'vehicle categories Lahore',
    'luxury car rental',
    'SUV hire lahore',
    'business car rental pakistan',
  ],
};

const resolveSearchParams = async (searchParams) => {
  if (!searchParams) return {};
  if (typeof searchParams.then === 'function') {
    return await searchParams;
  }
  return searchParams;
};

const hasPrimaryFilter = (searchParams) => {
  if (!searchParams) return false;
  const { category, brand, allCars } = searchParams;
  return Boolean(category) || Boolean(brand) || allCars === 'true';
};

const buildPathWithQuery = (searchParams) => {
  if (!searchParams || Object.keys(searchParams).length === 0) {
    return '/vehicle-types';
  }

  const segments = Object.entries(searchParams)
    .filter(([_, value]) => typeof value === 'string' && value.length > 0)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    );

  const queryString = segments.join('&');
  return queryString ? `/vehicle-types?${queryString}` : '/vehicle-types';
};

const buildDynamicTitle = (searchParams) => {
  const { category, brand, allCars } = searchParams || {};

  if (category) {
    return `${category} Car Rentals in Lahore | Convoy Travels`;
  }

  if (brand) {
    return `${brand} Vehicles in Lahore | Convoy Travels`;
  }

  if (allCars === 'true') {
    return 'Complete Vehicle Fleet in Lahore | Convoy Travels';
  }

  return DEFAULT_META.title;
};

const buildDynamicDescription = (searchParams) => {
  const { category, brand, allCars } = searchParams || {};

  if (category) {
    return `Explore ${category} vehicles with vetted chauffeurs, transparent pricing, and rapid confirmations across Lahore.`;
  }

  if (brand) {
    return `Discover the latest ${brand} models available for rent in Lahore with chauffeur and self-drive options.`;
  }

  if (allCars === 'true') {
    return 'Browse the full Convoy Travels fleet including SUVs, sedans, vans, and luxury vehicles with instant availability updates.';
  }

  return DEFAULT_META.description;
};

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const path = buildPathWithQuery(resolvedSearchParams);

  if (!hasPrimaryFilter(resolvedSearchParams)) {
    return buildPageMetadata({
      ...DEFAULT_META,
      path,
      robots: {
        index: false,
        follow: false,
      },
    });
  }

  // Try to fetch category SEO data from backend if category filter is present
  let categorySeoData = null;
  if (resolvedSearchParams.category) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories?status=Active`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });
      const data = await response.json();
      
      if (data.success && data.data?.categories) {
        const matchingCategory = data.data.categories.find(
          (cat) => cat.name === resolvedSearchParams.category || cat.slug === resolvedSearchParams.category
        );
        
        if (matchingCategory) {
          categorySeoData = extractSeoData(matchingCategory);
        }
      }
    } catch (error) {
      console.error('Error fetching category SEO data:', error);
      // Fall back to default metadata
    }
  }

  // Use backend SEO data if available, otherwise use generated defaults
  if (categorySeoData && (categorySeoData.seoTitle || categorySeoData.canonicalUrl)) {
    return buildDynamicMetadata({
      ...categorySeoData,
      fallbackTitle: buildDynamicTitle(resolvedSearchParams),
      fallbackDescription: buildDynamicDescription(resolvedSearchParams),
      fallbackPath: path,
      keywords: DEFAULT_META.keywords,
    });
  }

  return buildPageMetadata({
    title: buildDynamicTitle(resolvedSearchParams),
    description: buildDynamicDescription(resolvedSearchParams),
    path,
    keywords: DEFAULT_META.keywords,
  });
}

export default async function VehicleTypesPage({ searchParams }) {
  const resolvedSearchParams = await resolveSearchParams(searchParams);

  if (!hasPrimaryFilter(resolvedSearchParams)) {
    notFound();
  }

  return (
    <main className="min-h-auto bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-[1400px] mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <Suspense fallback={<div className="text-center py-16">Loading...</div>}>
          <VehicleTypesContent />
        </Suspense>
      </div>
    </main>
  );
}
