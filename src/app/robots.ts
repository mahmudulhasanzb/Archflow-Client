import { MetadataRoute } from 'next';

/**
 * ============================================================================
 * ROBOTS.TXT DIRECTIVES (SEO, AEO, GEO Optimization)
 * ============================================================================
 * Instructs search engine crawlers (Google, Bing, Yandex) and AI search agents
 * (Perplexity, ChatGPT/GPTBot, ClaudeBot, Gemini) which public routes to index
 * and points directly to the XML sitemap.
 */

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://archflow-web-ai.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/workspace/',
        ],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'],
        allow: ['/', '/blueprints', '/about', '/docs'],
        disallow: ['/api/', '/workspace/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
