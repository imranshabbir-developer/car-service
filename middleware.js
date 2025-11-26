import { NextResponse } from 'next/server';

/**
 * Middleware to handle redirects for SEO-friendly routes
 * Converts old query parameter URLs to new slug-based URLs
 */
export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // Handle vehicle-types redirects: /vehicle-types?category=X → /vehicle-types/[category]
  if (pathname === '/vehicle-types') {
    const category = searchParams.get('category');
    
    if (category) {
      // Convert category name to slug format
      const slug = category
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      if (slug) {
        // Build new URL with slug
        const newUrl = new URL(`/vehicle-types/${slug}`, request.url);
        
        // Preserve other query parameters if any
        searchParams.forEach((value, key) => {
          if (key !== 'category') {
            newUrl.searchParams.set(key, value);
          }
        });
        
        // Redirect to new URL (301 permanent redirect for SEO)
        return NextResponse.redirect(newUrl, 301);
      }
    }
  }

  // Continue with normal request
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/vehicle-types',
  ],
};

