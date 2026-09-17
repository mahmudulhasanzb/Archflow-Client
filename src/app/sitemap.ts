import { MetadataRoute } from 'next';
import { baseURL } from '@/lib/api/baseUrl';

/**
 * ============================================================================
 * DYNAMIC SITEMAP GENERATOR (sitemap.xml)
 * ============================================================================
 * Generates XML sitemap indexing all public marketing, about, documentation,
 * and dynamically created public architecture blueprints for Google & AI engines.
 */

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://archflow-web-ai.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blueprints: Array<{ _id: string; updatedAt?: string; createdAt?: string }> = [];

  try {
    const res = await fetch(`${baseURL}/api/all-blueprints?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.blueprints)
        ? data.blueprints
        : [];
      blueprints = list.filter((b: any) => !b.isPrivate);
    }
  } catch (err) {
    console.error('Sitemap blueprint fetch error:', err);
    blueprints = [];
  }

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blueprints`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Dynamic blueprint detail pages
  const blueprintRoutes: MetadataRoute.Sitemap = blueprints.map((bp) => ({
    url: `${siteUrl}/blueprints/${bp._id}`,
    lastModified: bp.updatedAt ? new Date(bp.updatedAt) : bp.createdAt ? new Date(bp.createdAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...blueprintRoutes];
}
