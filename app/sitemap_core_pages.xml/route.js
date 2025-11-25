export async function GET() {
  const baseUrl = 'https://convoytravels.pk';
  const currentDate = new Date().toISOString().split('T')[0];

  // Core static pages
  const corePages = [
    { url: '', priority: '1.0', changefreq: 'daily' }, // Home page
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/vehicle-types', priority: '0.9', changefreq: 'weekly' },
    { url: '/cars', priority: '0.9', changefreq: 'weekly' },
    { url: '/travel', priority: '0.7', changefreq: 'monthly' },
    { url: '/main-blogs', priority: '0.8', changefreq: 'weekly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${corePages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

