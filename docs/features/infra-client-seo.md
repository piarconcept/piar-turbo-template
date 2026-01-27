# @piar/infra-client-seo - SEO Infrastructure

## Purpose
Professional-grade SEO infrastructure package providing comprehensive tools for search engine optimization including meta tags, structured data (Schema.org), sitemaps, robots.txt, and validation utilities.

## Status
- [x] Completed - Full SEO toolkit implementation

## Overview

This package provides a complete, type-safe SEO toolkit for building search-engine-optimized applications. It includes everything needed to implement professional SEO:

- **Meta Tags**: Open Graph, Twitter Cards, canonical URLs, robots directives
- **Structured Data**: Schema.org JSON-LD (Organization, Article, Product, FAQ, etc.)
- **Sitemaps**: XML sitemap generation with images and alternate languages
- **Robots.txt**: Flexible robots.txt generation with templates
- **Validators**: SEO validation with scoring and recommendations
- **Utilities**: Text processing, slug generation, keyword extraction

## Architecture

### Package Structure

```
packages/infra/client/seo/
├── src/
│   ├── types/
│   │   ├── common.types.ts       # Common SEO types (Meta, OG, Twitter)
│   │   └── schema.types.ts       # Schema.org types
│   ├── builders/
│   │   ├── meta-tags.builder.ts  # Meta tags constructor
│   │   └── schema.builder.ts     # Schema.org builder
│   ├── generators/
│   │   ├── sitemap.generator.ts  # XML sitemap generator
│   │   └── robots.generator.ts   # Robots.txt generator
│   ├── utils/
│   │   └── seo.utils.ts          # SEO utilities
│   ├── validators/
│   │   └── seo.validator.ts      # SEO validation
│   └── index.ts                  # Main exports
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
└── README.md
```

### Design Principles

1. **Type-Safe**: Full TypeScript coverage with strict typing
2. **Builder Pattern**: Fluent API for constructing complex SEO structures
3. **Standards-Compliant**: Follows Open Graph, Schema.org, Sitemaps protocols
4. **Framework Agnostic**: Works with Next.js, React, or any framework
5. **Zero Dependencies**: Lightweight and fast
6. **Validation First**: Built-in validators with scoring and recommendations
7. **Developer Experience**: Excellent autocomplete and documentation

## Key Features

### 1. Meta Tags Builder

**Classes**:
- `MetaTagsBuilder` - Fluent API for building meta tags
- `createMetaTags()` - Quick helper function

**Capabilities**:
- Basic meta tags (title, description, keywords, author)
- Canonical URLs
- Robots directives (index, follow, max-snippet, max-image-preview)
- Open Graph metadata (type, title, description, images, videos, audio)
- Article-specific Open Graph (published/modified time, authors, tags)
- Twitter Card metadata (card type, creator, site, image)
- Alternate language versions (hreflang)
- Viewport and theme color
- Favicon links

**Example**:
```typescript
const { meta, link } = createMetaTags({
  metadata: {
    title: 'My Page',
    description: 'Page description',
    canonical: 'https://example.com/page',
    robots: { index: true, follow: true }
  },
  openGraph: {
    type: 'website',
    title: 'My Page',
    url: 'https://example.com/page',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }]
  }
});
```

### 2. Schema.org Structured Data

**Class**: `SchemaBuilder` - Static methods for all Schema.org types

**Supported Schemas**:
- Organization
- Person
- WebSite (with SearchAction)
- Article (Article, NewsArticle, BlogPosting)
- BreadcrumbList
- Product
- LocalBusiness (Store, Restaurant, Hotel)
- Event
- FAQPage
- HowTo
- VideoObject

**Features**:
- Type-safe schema construction
- Schema combination (JSON-LD @graph)
- Basic validation
- JSON-LD script tag generation

**Example**:
```typescript
const article = SchemaBuilder.article({
  '@type': 'Article',
  headline: 'My Article',
  author: { '@type': 'Person', name: 'John Doe' },
  publisher: organization,
  datePublished: '2026-01-24T00:00:00Z'
});

const jsonLd = SchemaBuilder.toJsonLd(article);
```

### 3. Sitemap Generation

**Classes**:
- `SitemapGenerator` - Main sitemap generator
- `SitemapIndexGenerator` - For large sites with multiple sitemaps
- `generateSitemap()` - Quick helper

**Features**:
- XML sitemap generation
- Image sitemaps
- Alternate language versions (hreflang)
- Change frequency and priority
- Pretty-print option
- Full XML escaping

**Example**:
```typescript
const generator = new SitemapGenerator({
  baseUrl: 'https://example.com',
  defaultChangefreq: 'weekly',
  defaultPriority: 0.7
});

generator.addUrl({
  loc: '/blog/post',
  lastmod: '2026-01-24',
  changefreq: 'daily',
  priority: 0.8,
  images: [{ loc: '/image.jpg', caption: 'Featured' }],
  alternates: [
    { hreflang: 'en', href: '/en/blog/post' },
    { hreflang: 'es', href: '/es/blog/post' }
  ]
});

const xml = generator.toXML();
```

### 4. Robots.txt Generation

**Classes**:
- `RobotsGenerator` - Flexible robots.txt builder
- `RobotsTemplates` - Pre-built templates
- `generateRobotsTxt()` - Quick helper

**Templates**:
- `allowAll()` - Allow all bots
- `disallowAll()` - Block all bots (staging/dev)
- `standardProduction()` - Standard production config
- `ecommerce()` - E-commerce optimized
- `blog()` - Blog optimized
- `blockBadBots()` - Block known bad bots

**Example**:
```typescript
const robots = RobotsTemplates.standardProduction({
  sitemaps: ['https://example.com/sitemap.xml'],
  host: 'https://example.com',
  disallowPaths: ['/admin', '/api', '/private']
});
```

### 5. SEO Validation

**Class**: `SEOValidator` - Comprehensive SEO validator

**Features**:
- Validate metadata (title length, description length, required fields)
- Validate Open Graph (type, title, URL, images, dimensions)
- Validate Twitter Cards (card type, image, character limits)
- SEO score calculation (0-100)
- Improvement recommendations
- Detailed error/warning/recommendation messages

**Example**:
```typescript
const validator = new SEOValidator();

const result = validator.validateAll({
  metadata: { title: 'My Page', description: 'Description' },
  openGraph: { type: 'website', title: 'My Page', url: '...' }
});

const score = validator.calculateSEOScore({ metadata, openGraph });
const improvements = validator.getImprovements({ metadata, openGraph });
```

### 6. SEO Utilities

**Functions**:
- `sanitizeText()` - Remove HTML, normalize whitespace
- `truncateText()` - Smart truncation at word boundaries
- `generateMetaDescription()` - Create description from content
- `extractKeywords()` - Extract most common words
- `createSlug()` - URL-friendly slugs
- `generateCanonicalUrl()` - Build canonical URLs
- `isValidUrl()` - URL validation
- `getCurrentISODate()` - ISO date strings
- `calculateReadingTime()` - Estimate reading time
- `validateMetaDescription()` - Validate description length
- `validateTitle()` - Validate title length
- And more...

## Integration Guide

### Next.js App Router

#### 1. Metadata in page.tsx

```typescript
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Page description',
  openGraph: {
    title: 'My Page',
    description: 'Page description',
    url: 'https://example.com/page',
    images: [{
      url: 'https://example.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Page preview'
    }]
  }
};
```

#### 2. Structured Data in page.tsx

```typescript
// app/page.tsx
import { SchemaBuilder } from '@piar/infra-client-seo';

export default function Page() {
  const schema = SchemaBuilder.article({
    '@type': 'Article',
    headline: 'My Article',
    author: { '@type': 'Person', name: 'John Doe' },
    datePublished: '2026-01-24T00:00:00Z'
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h1>My Article</h1>
    </>
  );
}
```

#### 3. Sitemap (app/sitemap.xml/route.ts)

```typescript
import { generateSitemap } from '@piar/infra-client-seo';

export async function GET() {
  // Fetch your URLs from database/CMS
  const urls = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.8 }
  ];

  const sitemap = generateSitemap(urls, {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL!
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
```

#### 4. Robots.txt (app/robots.txt/route.ts)

```typescript
import { RobotsTemplates } from '@piar/infra-client-seo';

export async function GET() {
  const isProduction = process.env.NODE_ENV === 'production';

  const robots = isProduction
    ? RobotsTemplates.standardProduction({
        sitemaps: [`${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`]
      })
    : RobotsTemplates.disallowAll();

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}
```

### Reusable SEO Components

Create a reusable SEO component:

```typescript
// components/seo/page-seo.tsx
import { SchemaBuilder } from '@piar/infra-client-seo';
import type { Metadata } from 'next';

interface PageSEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generatePageMetadata({
  title,
  description,
  path,
  image
}: PageSEOProps): Metadata {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
  const ogImage = image || `${process.env.NEXT_PUBLIC_BASE_URL}/og-default.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{
        url: ogImage,
        width: 1200,
        height: 630
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    }
  };
}

export function PageSchema({ title, description, publishedTime }: PageSEOProps) {
  const schema = SchemaBuilder.article({
    '@type': 'Article',
    headline: title,
    description,
    datePublished: publishedTime || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: 'Your Name'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Site',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`
      }
    }
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

## Best Practices

### Title Optimization
- **Length**: 50-60 characters (Google displays ~60)
- **Structure**: Primary Keyword | Secondary Keyword | Brand
- **Uniqueness**: Every page should have a unique title
- **Keywords**: Include primary keyword near the beginning
- **Brand**: Include brand name at the end

### Meta Description
- **Length**: 150-160 characters (Google displays ~160)
- **Compelling**: Write to encourage clicks
- **Keywords**: Include target keywords naturally
- **Call-to-Action**: Use action words (Learn, Discover, Find out)
- **Uniqueness**: Every page should have a unique description

### Open Graph Images
- **Dimensions**: 1200x630 pixels (1.91:1 aspect ratio)
- **File Size**: Under 8MB, ideally under 500KB
- **Format**: JPG or PNG
- **Content**: High-quality, relevant, branded
- **Text**: Include text overlay for better sharing

### Structured Data
- **Organization**: Include on every page
- **BreadcrumbList**: Use on all pages for navigation
- **Article**: Required for blog posts and news
- **Product**: Essential for e-commerce
- **LocalBusiness**: For businesses with physical locations
- **FAQ**: For FAQ pages to get rich snippets
- **Validation**: Always validate with Google's Rich Results Test

### Sitemaps
- **Frequency**: Update daily for dynamic content
- **lastmod**: Always include accurate last modification dates
- **Priority**: Use wisely (homepage: 1.0, important pages: 0.8)
- **Images**: Include image sitemaps for image search
- **Alternates**: Include hreflang for multilingual sites
- **Index**: Use sitemap index for sites with >50,000 URLs

### Robots.txt
- **Specificity**: Be precise with disallow rules
- **Testing**: Test with Google's robots.txt Tester
- **Sitemaps**: Always include sitemap URLs
- **Environment**: Different configs for dev/staging/production
- **Crawl-delay**: Use sparingly, only if needed

## Testing & Validation

### Run Tests
```bash
pnpm --filter @piar/infra-client-seo test
pnpm --filter @piar/infra-client-seo test:coverage
```

### Type Checking
```bash
pnpm --filter @piar/infra-client-seo typecheck
```

### Linting
```bash
pnpm --filter @piar/infra-client-seo lint
```

### SEO Validation in Code
```typescript
import { SEOValidator } from '@piar/infra-client-seo';

const validator = new SEOValidator();
const score = validator.calculateScore({ metadata, openGraph, twitter });
console.log(`SEO Score: ${score}/100`);
```

## External Validation Tools

- **Google Search Console**: Monitor indexing and performance
- **Google Rich Results Test**: Validate structured data
- **Bing Webmaster Tools**: Bing-specific optimization
- **Schema.org Validator**: Validate JSON-LD
- **Facebook Sharing Debugger**: Test Open Graph tags
- **Twitter Card Validator**: Test Twitter Cards
- **Screaming Frog**: Crawl and audit your site
- **Lighthouse**: Automated SEO audits

## Common Patterns

### Pattern 1: Dynamic Blog Post SEO

```typescript
// app/blog/[slug]/page.tsx
import { generatePageMetadata, PageSchema } from '@/components/seo';
import { getPost } from '@/lib/blog';

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  
  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${params.slug}`,
    image: post.featuredImage,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt
  });
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);

  return (
    <>
      <PageSchema
        title={post.title}
        description={post.excerpt}
        path={`/blog/${params.slug}`}
        publishedTime={post.publishedAt}
      />
      <article>{/* content */}</article>
    </>
  );
}
```

### Pattern 2: E-commerce Product SEO

```typescript
// app/products/[slug]/page.tsx
import { SchemaBuilder } from '@piar/infra-client-seo';

export default async function Product({ params }) {
  const product = await getProduct(params.slug);

  const productSchema = SchemaBuilder.product({
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand,
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  });

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      {/* product UI */}
    </>
  );
}
```

### Pattern 3: Multi-language SEO

```typescript
// app/[locale]/page.tsx
import { MetaTagsBuilder } from '@piar/infra-client-seo';

const locales = ['en', 'es', 'fr'];

export async function generateMetadata({ params }) {
  const { locale } = params;
  
  const builder = new MetaTagsBuilder();
  builder.setBasicMetadata({
    title: getTitle(locale),
    description: getDescription(locale)
  });

  // Add alternate languages
  builder.addAlternateLanguages(
    locales.map(lang => ({
      lang,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}`
    }))
  );

  return builder.build();
}
```

## Related Documentation

- [Repository Configuration](../../../../docs/features/repository-configuration.md)
- [Creating Packages](../../../../docs/features/creating-packages.md)
- [Testing Guide](../../../../docs/features/testing-guide.md)

## External Resources

- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Google Search Central](https://developers.google.com/search)
- [Sitemaps Protocol](https://www.sitemaps.org/)
- [Robots.txt Specification](https://www.robotstxt.org/)

## Notes

- This package is framework-agnostic and can be used with any JavaScript framework
- All functions are pure and have no side effects
- Zero runtime dependencies ensures minimal bundle impact
- Full TypeScript support with strict typing
- Follows all modern SEO best practices and standards

## Last Updated
24 January 2026 - Initial SEO infrastructure package creation
