/**
 * Dynamic SEO Utility for Next.js App Router
 * Builds metadata from backend API responses
 */

import { buildPageMetadata } from './seo';

/**
 * Build metadata from backend SEO data
 * @param {Object} seoData - SEO data from backend
 * @param {string} seoData.seoTitle - SEO title (or metaTitle for blogs)
 * @param {string} seoData.seoDescription - SEO description (or metaDescription for blogs)
 * @param {string} seoData.canonicalUrl - Canonical URL
 * @param {string} fallbackTitle - Fallback title if seoTitle not provided
 * @param {string} fallbackDescription - Fallback description if seoDescription not provided
 * @param {string} fallbackPath - Fallback path for canonical if canonicalUrl not provided
 * @returns {Object} - Next.js metadata object
 */
export function buildDynamicMetadata({
  seoTitle,
  seoDescription,
  canonicalUrl,
  fallbackTitle,
  fallbackDescription,
  fallbackPath = '/',
  keywords = [],
  image,
  robots,
}) {
  // Use backend SEO fields if available, otherwise use fallbacks
  const title = seoTitle || fallbackTitle || 'Convoy Travels - Rent a Car in Lahore';
  const description = seoDescription || fallbackDescription || 'Rent a car in Lahore with or without driver. Affordable car rental services.';
  
  // Use canonical URL from backend if provided, otherwise generate from fallback path
  const canonical = canonicalUrl || `https://convoytravels.pk${fallbackPath}`;

  return buildPageMetadata({
    title,
    description,
    path: canonical.replace('https://convoytravels.pk', '') || fallbackPath,
    keywords,
    image,
    robots,
  });
}

/**
 * Extract SEO data from backend API response
 * Handles different response structures and field names
 * @param {Object} data - Backend API response data
 * @returns {Object} - Normalized SEO data
 */
export function extractSeoData(data) {
  if (!data) return {};

  // Handle different field name conventions
  // Blog uses metaTitle/metaDescription, others use seoTitle/seoDescription
  const seoTitle = data.seoTitle || data.metaTitle || null;
  const seoDescription = data.seoDescription || data.metaDescription || null;
  const canonicalUrl = data.canonicalUrl || null;
  const slug = data.slug || null; // Always include slug from backend

  return {
    seoTitle,
    seoDescription,
    canonicalUrl,
    slug, // Include slug for canonical URL generation
  };
}

/**
 * Build metadata for car detail page
 */
export function buildCarMetadata(car, fallbackTitle, fallbackDescription) {
  const seoData = extractSeoData(car);
  
  return buildDynamicMetadata({
    ...seoData,
    fallbackTitle: fallbackTitle || `${car?.name || 'Car'} - Rent in Lahore | Convoy Travels`,
    fallbackDescription: fallbackDescription || `Rent ${car?.name || 'this car'} in Lahore with Convoy Travels. ${car?.rentPerDay ? `Starting at Rs ${car.rentPerDay} per day.` : 'Affordable car rental service.'}`,
    fallbackPath: car?.slug ? `/cars/${car.slug}` : (car?._id ? `/cars/${car._id}` : '/cars'),
    keywords: [
      `rent ${car?.name || 'car'} Lahore`,
      `${car?.brand || ''} ${car?.model || ''} rental`,
      'convoy travels',
      'car rental Lahore',
    ].filter(Boolean),
  });
}

/**
 * Build metadata for category/vehicle type page
 */
export function buildCategoryMetadata(category, fallbackTitle, fallbackDescription) {
  const seoData = extractSeoData(category);
  
  return buildDynamicMetadata({
    ...seoData,
    fallbackTitle: fallbackTitle || `${category?.name || 'Vehicle Type'} Car Rental in Lahore | Convoy Travels`,
    fallbackDescription: fallbackDescription || `Rent ${category?.name || 'vehicles'} in Lahore with Convoy Travels. ${category?.description || 'Affordable car rental services.'}`,
    fallbackPath: category?.slug ? `/vehicle-types/${category.slug}` : '/vehicle-types',
    keywords: [
      `${category?.name || 'vehicle'} rental Lahore`,
      `${category?.name || 'vehicle'} car rental`,
      'convoy travels',
    ].filter(Boolean),
  });
}

/**
 * Build metadata for blog page
 */
export function buildBlogMetadata(blog, fallbackTitle, fallbackDescription) {
  const seoData = extractSeoData(blog);
  
  return buildDynamicMetadata({
    ...seoData,
    fallbackTitle: fallbackTitle || `${blog?.title || blog?.blogTitle || 'Blog'} | Convoy Travels`,
    fallbackDescription: fallbackDescription || blog?.description || 'Read our latest blog posts about car rental in Lahore.',
    fallbackPath: blog?.slug ? `/blog/${blog.slug}` : '/blog',
    keywords: ['convoy travels blog', 'car rental blog', 'Lahore car rental'],
  });
}

