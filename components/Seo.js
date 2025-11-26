'use client';

import { useEffect } from 'react';

/**
 * Client-side SEO Component
 * Updates document head with SEO meta tags dynamically
 * Use this for client components that fetch data after mount
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.canonical - Canonical URL
 */
export default function Seo({ title, description, canonical }) {
  useEffect(() => {
    if (!title && !description && !canonical) {
      return; // No SEO data to update
    }

    // Store original values for cleanup
    const originalTitle = document.title;
    let metaDescription = null;
    let canonicalLink = null;

    // Update title
    if (title) {
      document.title = title;
    }

    // Update or create meta description
    if (description) {
      metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }

    // Update or create canonical link
    if (canonical) {
      canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonical);
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonical;
        document.head.appendChild(link);
      }
    }

    // Cleanup function
    return () => {
      // Only restore if this component was the last to set it
      // In practice, this is a simple cleanup - Next.js will handle the main metadata
      if (title && document.title === title) {
        // Could restore originalTitle, but Next.js metadata will handle it
      }
    };
  }, [title, description, canonical]);

  // This component doesn't render anything
  return null;
}

