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
          '/api/auth/',
          '/api/checkout_session/',
          '/workspace/',
          '/add-blueprint/',
          '/my-blueprints/',
          '/manage-blueprints/',
        ],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'],
        allow: ['/', '/blueprints', '/about', '/docs'],
        disallow: ['/api/', '/workspace/', '/my-blueprints/', '/manage-blueprints/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
