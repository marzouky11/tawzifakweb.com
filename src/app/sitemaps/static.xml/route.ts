
const baseUrl = 'https://www.tawzifak.com';

const staticPages = [
  { url: '/jobs', priority: 0.9, changeFrequency: 'daily' },
  { url: '/workers', priority: 0.9, changeFrequency: 'daily' },
  { url: '/competitions', priority: 0.9, changeFrequency: 'daily' },
  { url: '/articles', priority: 0.7, changeFrequency: 'weekly' },
  { url: '/cv-builder', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/about', priority: 0.5, changeFrequency: 'yearly' },
  { url: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/faq', priority: 0.5, changeFrequency: 'yearly' },
  { url: '/login', priority: 0.4, changeFrequency: 'yearly' },
  { url: '/signup', priority: 0.4, changeFrequency: 'yearly' },
];

function generateSitemap() {
  const lastmod = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${staticPages
       .map(({ url, priority, changeFrequency }) => {
         return `
       <url>
           <loc>${baseUrl}${url}</loc>
           <lastmod>${lastmod}</lastmod>
           <changefreq>${changeFrequency}</changefreq>
           <priority>${priority}</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export async function GET() {
  const sitemap = generateSitemap();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}

