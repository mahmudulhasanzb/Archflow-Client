import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Geist_Mono } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';

const SupportChat = dynamic(() => import('@/components/SupportChat'));

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || 'https://archflow-web-ai.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Archflow — AI Software Architecture Engine',
    template: '%s | Archflow',
  },
  description:
    'Generate production-ready software architecture blueprints and markdown spec suites for Cursor and Claude Code with AI.',
  applicationName: 'Archflow',
  authors: [
    {
      name: 'Mahmudul Hasan',
      url: 'https://mahmudulhasan-dev.vercel.app',
    },
  ],
  creator: 'Mahmudul Hasan',
  publisher: 'Mahmudul Hasan',
  keywords: [
    'Archflow',
    'AI Software Architect',
    'AI Architecture Engine',
    'Multi Agent System',
    'Software Architecture Blueprints',
    'Cursor AI Specs',
    'Claude Code System Specs',
    'System Design Generator',
    'Database Schema Generator',
    'Next.js 16 App Router',
    'Mahmudul Hasan',
    'Full Stack Developer Bangladesh',
    'Full Stack Developer Sylhet',
    'AI Integration Specialist Bangladesh',
    'mahmudulhasanzb',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Archflow',
    title: 'Archflow — AI Software Architecture Engine',
    description:
      'Turn ideas into production-ready software architecture blueprints and spec suites for AI IDEs.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Archflow — AI Multi-Agent Architecture Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Archflow — AI Software Architecture Engine',
    description:
      'Turn ideas into production-ready software architecture blueprints and spec suites for AI IDEs.',
    creator: '@mahmudulhasanzb',
    images: [`${siteUrl}/og-image.png`],
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data (JSON-LD) for SEO, AEO, and GEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Archflow',
        description:
          'Archflow is an AI software architecture engine orchestrating multi-agent blueprint design.',
        publisher: {
          '@id': `${siteUrl}/#developer`,
        },
      },
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/#app`,
        name: 'Archflow',
        url: siteUrl,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'All',
        description:
          'Autonomous multi-agent platform generating complete engineering architecture specifications and markdown suites.',
        author: {
          '@id': `${siteUrl}/#developer`,
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '0',
          highPrice: '29',
          offerCount: '2',
        },
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#developer`,
        name: 'Mahmudul Hasan',
        alternateName: ['mahmudulhasanzb', 'Mahmudul Hasan ZB', 'Hasan'],
        url: 'https://mahmudulhasan-dev.vercel.app',
        jobTitle: 'Full-Stack Developer & AI Integration Specialist',
        worksFor: {
          '@type': 'Organization',
          name: 'Freelance / Open to Opportunities',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Sylhet',
          addressRegion: 'Sylhet Division',
          addressCountry: 'Bangladesh',
        },
        email: 'mahmudulhasankk9@gmail.com',
        sameAs: [
          'https://github.com/mahmudulhasanzb',
          'https://linkedin.com/in/mahmudulhasanzb',
          'https://twitter.com/mahmudulhasanzb',
          'https://facebook.com/mahmudulhasanzb',
        ],
        knowsAbout: [
          'Next.js 16',
          'React 19',
          'Generative AI',
          'Multi-Agent Systems',
          'Express.js',
          'MongoDB',
          'PostgresSQL',
          'System Architecture',
          'Full Stack Web Development',
        ],
      },
    ],
  };
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
        <Toaster position="top-right" />
        <SupportChat />
      </body>
    </html>
  );
}
