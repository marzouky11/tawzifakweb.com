import { getArticles } from '@/lib/articles';

const baseUrl = 'https://www.tawzifak.com';

function generateSitemap(articles: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${articles
       .map(({ slug, date }) => {
         return `
       <url>
           <loc>${`${baseUrl}/articles/${slug}`}</loc>
           <lastmod>${new Date(date).toISOString().split('T')[0]}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export async function GET() {
  const articles = getArticles();
  const sitemap = generateSitemap(articles);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}

