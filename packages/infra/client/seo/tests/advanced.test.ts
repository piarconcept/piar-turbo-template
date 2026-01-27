import { describe, it, expect } from 'vitest';
import { MetaTagsBuilder, createMetaTags } from '../src/builders/meta-tags.builder';
import { SchemaBuilder } from '../src/builders/schema.builder';
import { SitemapGenerator, generateSitemap } from '../src/generators/sitemap.generator';
import { RobotsGenerator, RobotsTemplates } from '../src/generators/robots.generator';

describe('MetaTagsBuilder - Advanced', () => {
  it('should set Open Graph metadata', () => {
    const builder = new MetaTagsBuilder();
    builder.setOpenGraph({
      type: 'website',
      title: 'OG Title',
      description: 'OG Description',
      url: 'https://example.com',
      siteName: 'Test Site',
    });
    const result = builder.build();
    expect(result.meta.length).toBeGreaterThan(0);
  });

  it('should set Twitter Card metadata', () => {
    const builder = new MetaTagsBuilder();
    builder.setTwitterCard({
      card: 'summary',
      title: 'Twitter Title',
      description: 'Twitter Description',
    });
    const result = builder.build();
    expect(result.meta.length).toBeGreaterThan(0);
  });

  it('should add canonical link', () => {
    const builder = new MetaTagsBuilder();
    builder.setBasicMetadata({
      title: 'Test',
      canonical: 'https://example.com/page',
      description: 'Test description',
    });
    const result = builder.build();
    expect(result.link.length).toBeGreaterThan(0);
  });

  it('should use createMetaTags helper', () => {
    const result = createMetaTags({
      metadata: {
        title: 'Test Title',
        description: 'Test description',
      },
    });
    expect(result.meta).toBeDefined();
    expect(result.link).toBeDefined();
  });

  it('should handle article metadata', () => {
    const builder = new MetaTagsBuilder();
    builder.setArticle({
      publishedTime: '2026-01-27',
      modifiedTime: '2026-01-27',
      section: 'Technology',
      tags: ['seo', 'web'],
    });
    const result = builder.build();
    expect(result.meta.length).toBeGreaterThan(0);
  });

  it('should add alternate languages', () => {
    const builder = new MetaTagsBuilder();
    builder.addAlternateLanguages([
      { lang: 'es', url: 'https://example.com/es' },
      { lang: 'fr', url: 'https://example.com/fr' },
    ]);
    const result = builder.build();
    expect(result.link.length).toBeGreaterThan(0);
  });

  it('should set viewport', () => {
    const builder = new MetaTagsBuilder();
    builder.setViewport('width=device-width, initial-scale=1');
    const result = builder.build();
    const viewportTag = result.meta.find(tag => tag.name === 'viewport');
    expect(viewportTag).toBeDefined();
  });
});

describe('SchemaBuilder - Advanced', () => {
  it('should create Person schema', () => {
    const schema = SchemaBuilder.person({
      name: 'John Doe',
      url: 'https://example.com/john',
    });
    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe('John Doe');
  });

  it('should create WebSite schema', () => {
    const schema = SchemaBuilder.website({
      name: 'Example Site',
      url: 'https://example.com',
    });
    expect(schema['@type']).toBe('WebSite');
  });

  it('should create BreadcrumbList schema', () => {
    const schema = SchemaBuilder.breadcrumbList([
      { name: 'Home', url: 'https://example.com' },
      { name: 'Category', url: 'https://example.com/category' },
    ]);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toBeDefined();
  });

  it('should create Product schema', () => {
    const schema = SchemaBuilder.product({
      name: 'Test Product',
      description: 'Product description',
      offers: {
        '@type': 'Offer',
        price: '99.99',
        priceCurrency: 'USD',
      },
    });
    expect(schema['@type']).toBe('Product');
    expect(schema.name).toBe('Test Product');
  });
});

describe('SitemapGenerator - Advanced', () => {
  it('should add URL with all properties', () => {
    const generator = new SitemapGenerator({ baseUrl: 'https://example.com' });
    generator.addUrl({
      loc: '/page',
      lastmod: '2026-01-27',
      changefreq: 'weekly',
      priority: 0.8,
    });
    const xml = generator.toXML();
    expect(xml).toContain('<lastmod>');
    expect(xml).toContain('<changefreq>');
    expect(xml).toContain('<priority>');
  });

  it('should add multiple URLs at once', () => {
    const generator = new SitemapGenerator({ baseUrl: 'https://example.com' });
    generator.addUrls([
      { loc: '/page1' },
      { loc: '/page2' },
      { loc: '/page3' },
    ]);
    const xml = generator.toXML();
    expect(xml).toContain('/page1');
    expect(xml).toContain('/page2');
    expect(xml).toContain('/page3');
  });

  it('should handle URL with alternates', () => {
    const generator = new SitemapGenerator({ baseUrl: 'https://example.com' });
    generator.addUrl({
      loc: '/page',
      alternates: [
        { hreflang: 'es', href: 'https://example.com/es/page' },
        { hreflang: 'fr', href: 'https://example.com/fr/page' },
      ],
    });
    const xml = generator.toXML();
    expect(xml).toContain('xhtml:link');
    expect(xml).toContain('hreflang');
  });

  it('should handle URL with images', () => {
    const generator = new SitemapGenerator({ baseUrl: 'https://example.com' });
    generator.addUrl({
      loc: '/page',
      images: [
        {
          loc: 'https://example.com/image.jpg',
          caption: 'Image caption',
          title: 'Image title',
        },
      ],
    });
    const xml = generator.toXML();
    expect(xml).toContain('image:image');
    expect(xml).toContain('image:loc');
  });
});

describe('RobotsGenerator - Advanced', () => {
  it('should add multiple rules', () => {
    const generator = new RobotsGenerator();
    generator.addRule({
      userAgent: '*',
      allow: ['/'],
    });
    generator.addRule({
      userAgent: 'Googlebot',
      disallow: ['/private'],
    });
    const result = generator.build();
    expect(result).toContain('User-agent: *');
    expect(result).toContain('User-agent: Googlebot');
  });

  it('should add sitemap', () => {
    const generator = new RobotsGenerator();
    generator.addSitemap('https://example.com/sitemap.xml');
    const result = generator.build();
    expect(result).toContain('Sitemap: https://example.com/sitemap.xml');
  });

  it('should add multiple sitemaps', () => {
    const generator = new RobotsGenerator();
    generator.addSitemaps([
      'https://example.com/sitemap1.xml',
      'https://example.com/sitemap2.xml',
    ]);
    const result = generator.build();
    expect(result).toContain('sitemap1.xml');
    expect(result).toContain('sitemap2.xml');
  });

  it('should set host', () => {
    const generator = new RobotsGenerator();
    generator.setHost('https://example.com');
    const result = generator.build();
    expect(result).toContain('Host: https://example.com');
  });

  it('should use standardProduction template', () => {
    const result = RobotsTemplates.standardProduction({
      sitemaps: ['https://example.com/sitemap.xml'],
      host: 'https://example.com',
    });
    expect(result).toContain('User-agent: *');
    expect(result).toContain('Disallow: /admin');
    expect(result).toContain('Sitemap:');
    expect(result).toContain('Host:');
  });

  it('should use standardProduction with custom disallow paths', () => {
    const result = RobotsTemplates.standardProduction({
      sitemaps: ['https://example.com/sitemap.xml'],
      disallowPaths: ['/custom-private', '/custom-admin'],
    });
    expect(result).toContain('Disallow: /custom-private');
    expect(result).toContain('Disallow: /custom-admin');
  });
});
