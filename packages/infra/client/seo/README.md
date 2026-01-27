# @piar/infra-client-seo

> **Professional SEO Infrastructure for Web Applications**
> 
> A comprehensive, type-safe SEO toolkit for building search-engine-optimized applications. Includes meta tags, structured data, sitemaps, and more.

## ✨ Features

- ✅ **Meta Tags Builder** - Generate all SEO meta tags (Open Graph, Twitter Cards, etc.)
- ✅ **Schema.org Builders** - Create JSON-LD structured data for rich snippets
- ✅ **Sitemap Generator** - XML sitemaps with images and alternate languages
- ✅ **Robots.txt Builder** - Control crawler access with templates
- ✅ **SEO Validators** - Validate metadata and get recommendations
- ✅ **Utilities** - Text sanitization, slug generation, keyword extraction
- ✅ **TypeScript First** - Fully typed for autocomplete and type safety
- ✅ **Framework Agnostic** - Works with Next.js, React, or any framework
- ✅ **Zero Dependencies** - Lightweight and fast

## 📦 Installation

```bash
pnpm install @piar/infra-client-seo
```

## 🚀 Quick Start

### Meta Tags

```typescript
import { createMetaTags } from '@piar/infra-client-seo';

const { meta, link } = createMetaTags({
  metadata: {
    title: 'My Awesome Page',
    description: 'This is a great page with amazing content that helps users achieve their goals.',
    canonical: 'https://example.com/page',
    keywords: ['seo', 'web', 'optimization'],
    robots: {
      index: true,
      follow: true,
      maxImagePreview: 'large'
    }
  },
  openGraph: {
    type: 'website',
    title: 'My Awesome Page',
    description: 'Share description',
    url: 'https://example.com/page',
    siteName: 'My Site',
    images: [{
      url: 'https://example.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Page preview'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mysite',
    creator: '@author'
  }
});

// In Next.js App Router (app/page.tsx)
export const metadata = {
  title: 'My Awesome Page',
  description: 'Page description',
  // ... other metadata
};
```

### Advanced Meta Tags Builder

```typescript
import { MetaTagsBuilder } from '@piar/infra-client-seo';

const builder = new MetaTagsBuilder();

const { meta, link } = builder
  .setBasicMetadata({
    title: 'My Page',
    description: 'Description here',
    canonical: 'https://example.com/page'
  })
  .setOpenGraph({
    type: 'article',
    title: 'My Article',
    url: 'https://example.com/article'
  })
  .setArticle({
    publishedTime: '2026-01-24T00:00:00Z',
    authors: ['John Doe'],
    section: 'Technology',
    tags: ['web', 'seo', 'nextjs']
  })
  .setTwitterCard({
    card: 'summary_large_image',
    site: '@mysite'
  })
  .addAlternateLanguages([
    { lang: 'en', url: 'https://example.com/en/page' },
    { lang: 'es', url: 'https://example.com/es/page' }
  ])
  .setViewport()
  .setThemeColor('#ec6b38')
  .build();
```

### Schema.org Structured Data

```typescript
import { SchemaBuilder } from '@piar/infra-client-seo';

// Organization schema
const organization = SchemaBuilder.organization({
  name: 'My Company',
  url: 'https://example.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://example.com/logo.png'
  },
  contactPoint: [{
    '@type': 'ContactPoint',
    telephone: '+1-555-0123',
    contactType: 'customer service'
  }]
});

// Article schema
const article = SchemaBuilder.article({
  '@type': 'Article',
  headline: 'How to Optimize Your Website for SEO',
  author: {
    '@type': 'Person',
    name: 'John Doe'
  },
  publisher: organization,
  datePublished: '2026-01-24T00:00:00Z',
  image: 'https://example.com/article-image.jpg'
});

// BreadcrumbList schema
const breadcrumbs = SchemaBuilder.breadcrumbList([
  { name: 'Home', url: 'https://example.com' },
  { name: 'Blog', url: 'https://example.com/blog' },
  { name: 'Article', url: 'https://example.com/blog/article' }
]);

// Combine multiple schemas
const jsonLd = SchemaBuilder.combineSchemas([
  organization,
  article,
  breadcrumbs
]);

// In Next.js
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Your page content */}
    </>
  );
}
```

### Website with Search

```typescript
const websiteSchema = SchemaBuilder.websiteWithSearch({
  name: 'My Website',
  url: 'https://example.com',
  searchUrl: 'https://example.com/search?q={search_term_string}',
  publisher: organization
});
```

### Product Schema

```typescript
const product = SchemaBuilder.product({
  name: 'Amazing Product',
  description: 'The best product ever',
  brand: 'My Brand',
  sku: 'ABC123',
  offers: {
    '@type': 'Offer',
    price: '99.99',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://example.com/product'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.5,
    reviewCount: 120
  }
});
```

### FAQ Schema

```typescript
const faq = SchemaBuilder.faqPage([
  {
    question: 'What is SEO?',
    answer: 'SEO stands for Search Engine Optimization...'
  },
  {
    question: 'Why is SEO important?',
    answer: 'SEO helps your website rank higher in search results...'
  }
]);
```

### Sitemap Generation

```typescript
import { SitemapGenerator, generateSitemap } from '@piar/infra-client-seo';

// Using the generator
const generator = new SitemapGenerator({
  baseUrl: 'https://example.com',
  defaultChangefreq: 'weekly',
  defaultPriority: 0.7
});

generator
  .addUrl({
    loc: '/',
    changefreq: 'daily',
    priority: 1.0
  })
  .addUrl({
    loc: '/about',
    changefreq: 'monthly',
    priority: 0.8
  })
  .addUrl({
    loc: '/blog/post-1',
    lastmod: '2026-01-24',
    changefreq: 'weekly',
    priority: 0.6,
    images: [{
      loc: 'https://example.com/images/post-1.jpg',
      caption: 'Featured image',
      title: 'Post 1 Image'
    }],
    alternates: [
      { hreflang: 'en', href: 'https://example.com/en/blog/post-1' },
      { hreflang: 'es', href: 'https://example.com/es/blog/post-1' }
    ]
  });

const xml = generator.toXML();

// Or use the helper function
const xml2 = generateSitemap(
  [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.8 }
  ],
  { baseUrl: 'https://example.com' }
);

// In Next.js (app/sitemap.xml/route.ts)
export async function GET() {
  const sitemap = generateSitemap(urls, { baseUrl: 'https://example.com' });
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
```

### Sitemap Index

```typescript
import { SitemapIndexGenerator } from '@piar/infra-client-seo';

const index = new SitemapIndexGenerator();

index
  .addSitemap('https://example.com/sitemap-posts.xml', '2026-01-24')
  .addSitemap('https://example.com/sitemap-pages.xml', '2026-01-20')
  .addSitemap('https://example.com/sitemap-products.xml', '2026-01-23');

const xml = index.toXML();
```

### Robots.txt Generation

```typescript
import { RobotsGenerator, RobotsTemplates } from '@piar/infra-client-seo';

// Using templates
const robotsTxt = RobotsTemplates.standardProduction({
  sitemaps: ['https://example.com/sitemap.xml'],
  host: 'https://example.com',
  disallowPaths: ['/admin', '/api', '/private']
});

// Custom configuration
const generator = new RobotsGenerator();

generator
  .addRule({
    userAgent: '*',
    allow: ['/'],
    disallow: ['/admin', '/api']
  })
  .addRule({
    userAgent: 'Googlebot',
    allow: ['/'],
    disallow: ['/admin']
  })
  .addSitemap('https://example.com/sitemap.xml')
  .setHost('https://example.com');

const robotsTxt2 = generator.build();

// In Next.js (app/robots.txt/route.ts)
export async function GET() {
  const robots = RobotsTemplates.standardProduction({
    sitemaps: ['https://example.com/sitemap.xml']
  });
  
  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}
```

### Available Templates

```typescript
// Allow all bots
RobotsTemplates.allowAll(['https://example.com/sitemap.xml']);

// Disallow all (staging/dev)
RobotsTemplates.disallowAll();

// E-commerce template
RobotsTemplates.ecommerce({
  sitemaps: ['https://example.com/sitemap.xml'],
  host: 'https://example.com'
});

// Blog template
RobotsTemplates.blog({
  sitemaps: ['https://example.com/sitemap.xml']
});

// Block bad bots
RobotsTemplates.blockBadBots({
  userAgent: '*',
  allow: ['/'],
  disallow: ['/admin']
});
```

### SEO Validation

```typescript
import { SEOValidator, validateSEO } from '@piar/infra-client-seo';

const validator = new SEOValidator();

const result = validator.validateAll({
  metadata: {
    title: 'My Page',
    description: 'Short',
    canonical: 'https://example.com/page'
  },
  openGraph: {
    type: 'website',
    title: 'My Page',
    url: 'https://example.com/page'
  }
});

console.log(result);
// {
//   valid: false,
//   errors: [],
//   warnings: ['Description: Too short. Aim for at least 150 characters.'],
//   recommendations: ['Open Graph image is highly recommended...']
// }

// Get SEO score (0-100)
const score = validator.calculateScore({
  metadata: { title: 'My Page', description: 'A great page...' },
  openGraph: { type: 'website', title: 'My Page', url: 'https://example.com' }
});

console.log(score); // 75

// Get improvement suggestions
const improvements = validator.getImprovements({
  metadata: { title: 'My Page', description: 'Short' }
});

console.log(improvements);
// ['⚠️ Description: Too short. Aim for at least 150 characters.']
```

### SEO Utilities

```typescript
import {
  sanitizeText,
  truncateText,
  generateMetaDescription,
  extractKeywords,
  createSlug,
  calculateReadingTime,
  validateMetaDescription,
  validateTitle
} from '@piar/infra-client-seo';

// Sanitize HTML
const clean = sanitizeText('<p>Hello <strong>World</strong></p>');
// 'Hello World'

// Truncate text
const short = truncateText('Very long text here...', 50);
// 'Very long text here...'

// Generate description from content
const description = generateMetaDescription(content, 160);

// Extract keywords
const keywords = extractKeywords(content, 10);
// ['seo', 'optimization', 'website', ...]

// Create URL slug
const slug = createSlug('My Awesome Blog Post!');
// 'my-awesome-blog-post'

// Calculate reading time
const minutes = calculateReadingTime(content);
// 5 (minutes)

// Validate description
const validation = validateMetaDescription('Too short');
// { valid: false, length: 9, recommendation: 'Too short...' }

// Validate title
const titleValidation = validateTitle('My Title');
// { valid: false, length: 8, recommendation: 'Too short...' }
```

## 📚 API Reference

### Types

- `SEOMetadata` - Basic page metadata
- `OpenGraphMetadata` - Open Graph tags
- `TwitterCardMetadata` - Twitter Card tags
- `RobotsDirective` - Robots meta configuration
- `SitemapUrl` - Sitemap URL entry
- Schema.org types: `Organization`, `Person`, `Article`, `Product`, `Event`, etc.

### Builders

- `MetaTagsBuilder` - Meta tags constructor
- `SchemaBuilder` - Schema.org JSON-LD builder

### Generators

- `SitemapGenerator` - XML sitemap generator
- `SitemapIndexGenerator` - Sitemap index generator
- `RobotsGenerator` - Robots.txt generator
- `RobotsTemplates` - Pre-built robots.txt templates

### Validators

- `SEOValidator` - Comprehensive SEO validation
- `validateSEO()` - Quick validation helper
- `calculateSEOScore()` - Get SEO score (0-100)

### Utilities

- Text processing: `sanitizeText`, `truncateText`, `generateMetaDescription`
- Keywords: `extractKeywords`
- URLs: `createSlug`, `generateCanonicalUrl`, `isValidUrl`
- Dates: `getCurrentISODate`, `formatDateISO`
- Validation: `validateMetaDescription`, `validateTitle`

## 🎯 Next.js Integration

### App Router (app/)

```typescript
// app/page.tsx
import { SchemaBuilder } from '@piar/infra-client-seo';
import type { Metadata } from 'next';

// Generate metadata
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
      height: 630
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mysite'
  }
};

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
      <h1>My Page</h1>
    </>
  );
}

// app/sitemap.xml/route.ts
import { generateSitemap } from '@piar/infra-client-seo';

export async function GET() {
  const urls = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.8 }
  ];

  const sitemap = generateSitemap(urls, { baseUrl: 'https://example.com' });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}

// app/robots.txt/route.ts
import { RobotsTemplates } from '@piar/infra-client-seo';

export async function GET() {
  const robots = RobotsTemplates.standardProduction({
    sitemaps: ['https://example.com/sitemap.xml']
  });

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}
```

## 🏆 Best Practices

### 1. Title Optimization
- Keep between 50-60 characters
- Include primary keyword near the beginning
- Make it compelling and unique
- Include brand name at the end

### 2. Meta Description
- Keep between 150-160 characters
- Include target keywords naturally
- Write compelling copy that encourages clicks
- Include a call-to-action when appropriate

### 3. Open Graph Images
- Use 1200x630 pixels (1.91:1 aspect ratio)
- Keep file size under 8MB
- Use high-quality, relevant images
- Include alt text for accessibility

### 4. Structured Data
- Always include Organization schema on every page
- Use BreadcrumbList for navigation
- Add Article schema to blog posts
- Include Product schema for e-commerce
- Validate with Google's Rich Results Test

### 5. Sitemaps
- Update regularly (daily for frequently changing content)
- Include lastmod dates
- Use sitemap index for large sites (>50,000 URLs)
- Submit to Google Search Console

### 6. Robots.txt
- Be specific with disallow rules
- Include sitemap URLs
- Test with Google's robots.txt Tester
- Different configs for dev/staging/production

## 🧪 Testing

```bash
# Run tests
pnpm --filter @piar/infra-client-seo test

# Run with coverage
pnpm --filter @piar/infra-client-seo test:coverage

# Type checking
pnpm --filter @piar/infra-client-seo typecheck

# Linting
pnpm --filter @piar/infra-client-seo lint
```

## 📝 Development

```bash
# Build the package
pnpm --filter @piar/infra-client-seo build

# Watch mode
pnpm --filter @piar/infra-client-seo dev
```

## 🔗 Resources

- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google Search Central](https://developers.google.com/search)
- [Sitemaps Protocol](https://www.sitemaps.org/)
- [Robots.txt Specification](https://www.robotstxt.org/)

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ by [Piar Concept](https://piarconcept.com)
