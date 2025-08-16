
import { getCompetitions } from '@/lib/data';

const baseUrl = 'https://www.tawzifak.com';

function generateSitemap(competitions: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${competitions
       .map(({ id, createdAt }) => {
         const lastModified = createdAt?.toDate ? createdAt.toDate() : new Date();
         return `
       <url>
           <loc>${`${baseUrl}/competitions/${id}`}</loc>
           <lastmod>${lastModified.toISOString().split('T')[0]}</lastmod>
           <changefreq>daily</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const competitions = await getCompetitions();
    const sitemap = generateSitemap(competitions);

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error("Error generating competitions sitemap:", error);
    return new Response('Error generating competitions sitemap', { status: 500 });
  }
}
