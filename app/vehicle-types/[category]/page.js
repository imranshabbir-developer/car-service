import { redirect, notFound } from 'next/navigation';
import { Suspense } from 'react';
import VehicleTypesContent from '../VehicleTypesContent';
import { buildDynamicMetadata, extractSeoData } from '@/utils/dynamicSeo';
import { API_BASE_URL } from '@/config/api';

// Fetch category by slug
async function getCategoryBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories?status=Active`, {
      next: { revalidate: 3600 },
    });
    const data = await response.json();
    
    if (data.success && data.data?.categories) {
      return data.data.categories.find(
        (cat) => cat.slug === slug || cat.name.toLowerCase().replace(/\s+/g, '-') === slug
      );
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  
  if (!category) {
    return {
      title: 'Vehicle Category Not Found | Convoy Travels',
      description: 'The vehicle category you are looking for could not be found.',
    };
  }

  const seoData = extractSeoData(category);
  
  // Use backend slug for canonical URL (best practice)
  const canonicalSlug = category.slug || categorySlug.toLowerCase().replace(/\s+/g, '-');
  const canonicalPath = `/vehicle-types/${canonicalSlug}`;
  
  return buildDynamicMetadata({
    ...seoData,
    fallbackTitle: `${category.name} Car Rentals in Lahore | Convoy Travels`,
    fallbackDescription: `Explore ${category.name} vehicles with vetted chauffeurs, transparent pricing, and rapid confirmations across Lahore.`,
    fallbackPath: canonicalPath,
    keywords: [
      `${category.name} rental Lahore`,
      `${category.name} car rental`,
      'convoy travels',
    ],
  });
}

export default async function VehicleTypesCategoryPage({ params }) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  
  if (!category) {
    notFound();
  }

  // Pass category as searchParams to VehicleTypesContent
  // This maintains compatibility with existing component
  const searchParams = {
    category: category.name,
  };

  return (
    <main className="min-h-auto bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="max-w-[1400px] mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
        <Suspense fallback={<div className="text-center py-16">Loading...</div>}>
          <VehicleTypesContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

