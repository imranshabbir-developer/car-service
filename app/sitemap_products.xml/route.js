import { API_BASE_URL } from '@/config/api';
import { generateSlug } from '@/utils/slug';

export async function GET() {
  const baseUrl = 'https://convoytravels.pk';
  const currentDate = new Date().toISOString().split('T')[0];

  try {
    // Fetch all cars from the API
    const response = await fetch(`${API_BASE_URL}/cars`, {
      cache: 'no-store', // Always fetch fresh data for sitemap
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }

    const data = await response.json();
    const cars = data?.success && data?.data?.cars ? data.data.cars : [];

    // Extract unique brands from cars
    const uniqueBrands = [...new Set(cars.map(car => car.brand).filter(Boolean))];

    // Generate URLs for cars
    const carUrls = cars
      .map((car) => {
        const carSlug = generateSlug(car.name);
        const carUrl = `${baseUrl}/cars/${carSlug}`;
        const lastmod = car.updatedAt
          ? new Date(car.updatedAt).toISOString().split('T')[0]
          : currentDate;

        return `  <url>
    <loc>${carUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join('\n');

    // Generate URLs for brand pages
    const brandUrls = uniqueBrands
      .map((brand) => {
        const brandSlug = encodeURIComponent(brand);
        const brandUrl = `${baseUrl}/brands/${brandSlug}`;
        return `  <url>
    <loc>${brandUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      })
      .join('\n');

    // Combine all URLs, filtering out empty strings
    const allUrls = [carUrls, brandUrls].filter(url => url.trim()).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls || ''}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating products sitemap:', error);
    
    // Return empty sitemap on error
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    return new Response(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

