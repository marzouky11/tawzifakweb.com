import { getArticles as getStaticArticles } from '@/lib/articles';
import { getArticles as getDbArticles } from '@/lib/data';

const baseUrl = 'https://www.tawzifak.com';

function generateSitemap(articles: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${articles
       .map(({ slug, createdAt, date }) => {
         const lastmodDate = createdAt ? createdAt.toDate() : new Date(date);
         return `
       <url>
           <loc>${`${baseUrl}/articles/${slug}`}</loc>
           <lastmod>${lastmodDate.toISOString().split('T')[0]}</lastmod>
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
  const staticArticles = getStaticArticles();
  const dbArticles = await getDbArticles();
  const allArticles = [...staticArticles, ...dbArticles];
  const sitemap = generateSitemap(allArticles);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
