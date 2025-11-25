import { API_BASE_URL } from '@/config/api';

export async function GET() {
  const baseUrl = 'https://convoytravels.pk';
  const currentDate = new Date().toISOString().split('T')[0];

  try {
    // Fetch all published blogs from the API
    const response = await fetch(`${API_BASE_URL}/main-blogs?isPublished=true`, {
      cache: 'no-store', // Always fetch fresh data for sitemap
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const data = await response.json();
    const blogs = data?.success && data?.data?.blogs ? data.data.blogs : [];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogs
  .map((blog) => {
    const blogUrl = `${baseUrl}/main-blog/${blog.slug || blog._id}`;
    const lastmod = blog.updatedAt
      ? new Date(blog.updatedAt).toISOString().split('T')[0]
      : blog.createdAt
      ? new Date(blog.createdAt).toISOString().split('T')[0]
      : currentDate;

    return `  <url>
    <loc>${blogUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating posts sitemap:', error);
    
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

