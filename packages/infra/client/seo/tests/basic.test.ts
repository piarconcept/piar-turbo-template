import { describe, it, expect } from 'vitest';

// Meta Tags Builder
import { MetaTagsBuilder } from '../src/builders/meta-tags.builder';

// Schema Builder
import { SchemaBuilder } from '../src/builders/schema.builder';

// Sitemap Generator
import { SitemapGenerator } from '../src/generators/sitemap.generator';

// Robots Generator
import { RobotsGenerator, RobotsTemplates } from '../src/generators/robots.generator';

// SEO Utils
import { sanitizeText, truncateText, createSlug, isValidUrl } from '../src/utils/seo.utils';

// SEO Validator
import { SEOValidator } from '../src/validators/seo.validator';

describe('MetaTagsBuilder', () => {
  it('should create empty builder', () => {
    const builder = new MetaTagsBuilder();
    const result = builder.build();
    expect(result).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.link).toBeDefined();
  });

  it('should set basic metadata', () => {
    const builder = new MetaTagsBuilder();
    builder.setBasicMetadata({
      title: 'Test Title',
      description: 'Test description',
    });
    const result = builder.build();
    expect(result.meta.length).toBeGreaterThan(0);
  });
});

describe('SchemaBuilder', () => {
  it('should create Organization schema', () => {
    const schema = SchemaBuilder.organization({
      name: 'Test Org',
      url: 'https://example.com',
    });
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('Test Org');
  });

  it('should convert schema to JSON-LD', () => {
    const schema = SchemaBuilder.organization({
      name: 'Test',
      url: 'https://test.com',
    });
    const jsonLd = SchemaBuilder.toJsonLd(schema);
    expect(typeof jsonLd).toBe('string');
    expect(jsonLd).toContain('"@context"');
  });
});

describe('SitemapGenerator', () => {
  it('should create generator with base URL', () => {
    const generator = new SitemapGenerator({
      baseUrl: 'https://example.com',
    });
    expect(generator).toBeDefined();
  });

  it('should generate XML sitemap', () => {
    const generator = new SitemapGenerator({
      baseUrl: 'https://example.com',
    });
    generator.addUrl({ loc: '/page1' });
    const xml = generator.toXML();
    expect(xml).toContain('<?xml');
    expect(xml).toContain('<urlset');
  });
});

describe('RobotsGenerator', () => {
  it('should create empty robots.txt', () => {
    const generator = new RobotsGenerator();
    const result = generator.build();
    expect(typeof result).toBe('string');
  });

  it('should add rule', () => {
    const generator = new RobotsGenerator();
    generator.addRule({
      userAgent: '*',
      allow: ['/'],
    });
    const result = generator.build();
    expect(result).toContain('User-agent: *');
    expect(result).toContain('Allow: /');
  });

  it('should use disallow all template', () => {
    const result = RobotsTemplates.disallowAll();
    expect(result).toContain('User-agent: *');
    expect(result).toContain('Disallow: /');
  });
});

describe('SEO Utils', () => {
  it('should sanitize text', () => {
    const result = sanitizeText('  Test  ');
    expect(result).toBe('Test');
  });

  it('should truncate text', () => {
    const result = truncateText('This is a long text', 10);
    expect(result.length).toBeLessThanOrEqual(13); // 10 + '...'
  });

  it('should create slug', () => {
    const result = createSlug('Test Title');
    expect(result).toBe('test-title');
  });

  it('should validate URL', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('not-a-url')).toBe(false);
  });
});

describe('SEOValidator', () => {
  it('should create validator instance', () => {
    const validator = new SEOValidator();
    expect(validator).toBeDefined();
  });

  it('should validate metadata', () => {
    const validator = new SEOValidator();
    const result = validator.validateMetadata({
      title: 'Good SEO title with proper length for search engines',
      description: 'Good SEO description with proper length for search engines to display in results',
      canonical: 'https://example.com',
    });
    expect(result).toBeDefined();
    expect(result.valid).toBeDefined();
    expect(typeof result.valid).toBe('boolean');
  });

  it('should calculate score', () => {
    const validator = new SEOValidator();
    const score = validator.calculateScore({
      metadata: {
        title: 'Good SEO title with proper length for search engines',
        description: 'Good SEO description with proper length for search engines to display in results properly with all details',
      },
    });
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
