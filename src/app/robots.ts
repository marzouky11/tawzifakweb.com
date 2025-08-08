import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.tawzifak.com';
  return {
    rules: [
        {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin-87hs6QpLm92/'],
        }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
