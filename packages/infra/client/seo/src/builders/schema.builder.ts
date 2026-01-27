/**
 * Schema.org JSON-LD builder
 * Creates structured data for search engines
 */

import type {
  Thing,
  Organization,
  Person,
  WebSite,
  Article,
  BreadcrumbList,
  Product,
  LocalBusiness,
  Event,
  FAQPage,
  HowTo,
  VideoObject,
} from '../types/schema.types';

/**
 * SchemaBuilder - Constructs Schema.org JSON-LD structured data
 * 
 * @example
 * ```typescript
 * const schema = SchemaBuilder.organization({
 *   name: 'My Company',
 *   url: 'https://example.com',
 *   logo: { url: 'https://example.com/logo.png' }
 * });
 * ```
 */
export class SchemaBuilder {
  /**
   * Create Organization schema
   */
  static organization(data: Omit<Organization, '@context' | '@type'>): Organization {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      ...data,
    };
  }

  /**
   * Create Person schema
   */
  static person(data: Omit<Person, '@context' | '@type'>): Person {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      ...data,
    };
  }

  /**
   * Create WebSite schema
   */
  static website(data: Omit<WebSite, '@context' | '@type'>): WebSite {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      ...data,
    };
  }

  /**
   * Create WebSite schema with SearchAction
   */
  static websiteWithSearch(options: {
    name: string;
    url: string;
    searchUrl: string;
    publisher?: Organization;
  }): WebSite {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: options.name,
      url: options.url,
      publisher: options.publisher,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: options.searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }

  /**
   * Create Article schema
   */
  static article(data: Omit<Article, '@context'>): Article {
    return {
      '@context': 'https://schema.org',
      ...data,
    };
  }

  /**
   * Create BlogPosting schema (extends Article)
   */
  static blogPosting(data: Omit<Article, '@context' | '@type'>): Article {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      ...data,
    };
  }

  /**
   * Create NewsArticle schema
   */
  static newsArticle(data: Omit<Article, '@context' | '@type'>): Article {
    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      ...data,
    };
  }

  /**
   * Create BreadcrumbList schema
   */
  static breadcrumbList(items: Array<{ name: string; url?: string }>): BreadcrumbList {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  /**
   * Create Product schema
   */
  static product(data: Omit<Product, '@context' | '@type'>): Product {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      ...data,
    };
  }

  /**
   * Create LocalBusiness schema
   */
  static localBusiness(data: Omit<LocalBusiness, '@context'>): LocalBusiness {
    return {
      '@context': 'https://schema.org',
      ...data,
    };
  }

  /**
   * Create Event schema
   */
  static event(data: Omit<Event, '@context' | '@type'>): Event {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      ...data,
    };
  }

  /**
   * Create FAQPage schema
   */
  static faqPage(questions: Array<{ question: string; answer: string }>): FAQPage {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions.map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer,
        },
      })),
    };
  }

  /**
   * Create HowTo schema
   */
  static howTo(data: Omit<HowTo, '@context' | '@type'>): HowTo {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      ...data,
    };
  }

  /**
   * Create VideoObject schema
   */
  static video(data: Omit<VideoObject, '@context' | '@type'>): VideoObject {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      ...data,
    };
  }

  /**
   * Convert schema to JSON-LD script tag content
   */
  static toJsonLd(schema: Thing | Thing[]): string {
    return JSON.stringify(schema, null, 2);
  }

  /**
   * Combine multiple schemas into a JSON-LD graph
   */
  static combineSchemas(schemas: Thing[]): string {
    const graph = {
      '@context': 'https://schema.org',
      '@graph': schemas,
    };
    return JSON.stringify(graph, null, 2);
  }

  /**
   * Validate required fields (basic validation)
   */
  static validate(schema: Thing): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!schema['@context']) {
      errors.push('Missing @context');
    }

    if (!schema['@type']) {
      errors.push('Missing @type');
    }

    // Type-specific validation
    if (schema['@type'] === 'Article') {
      const article = schema as Article;
      if (!article.headline) {
        errors.push('Article missing required headline');
      }
      if (!article.author) {
        errors.push('Article missing required author');
      }
      if (!article.datePublished) {
        errors.push('Article missing required datePublished');
      }
    }

    if (schema['@type'] === 'Product') {
      const product = schema as Product;
      if (!product.name) {
        errors.push('Product missing required name');
      }
      if (!product.offers) {
        errors.push('Product missing required offers');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Helper function to create JSON-LD script tag string for HTML
 */
export function createJsonLdScript(schema: Thing | Thing[]): string {
  const jsonLd = SchemaBuilder.toJsonLd(schema);
  return `<script type="application/ld+json">${jsonLd}</script>`;
}

/**
 * Helper function to create multiple schemas as a graph
 */
export function createSchemaGraph(schemas: Thing[]): string {
  return SchemaBuilder.combineSchemas(schemas);
}
