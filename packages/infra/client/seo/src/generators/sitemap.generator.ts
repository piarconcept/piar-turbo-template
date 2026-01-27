/**
 * Sitemap generator
 * Creates XML sitemaps following the Sitemaps protocol
 */

import type { SitemapUrl } from '../types/common.types';

/**
 * Sitemap options
 */
export interface SitemapOptions {
  /** Base URL of the website */
  baseUrl: string;
  /** Default change frequency */
  defaultChangefreq?: SitemapUrl['changefreq'];
  /** Default priority */
  defaultPriority?: number;
  /** Pretty print XML */
  prettyPrint?: boolean;
}

/**
 * SitemapGenerator - Creates XML sitemaps
 *
 * @example
 * ```typescript
 * const generator = new SitemapGenerator({
 *   baseUrl: 'https://example.com'
 * });
 *
 * generator.addUrl({
 *   loc: '/about',
 *   changefreq: 'monthly',
 *   priority: 0.8
 * });
 *
 * const xml = generator.toXML();
 * ```
 */
export class SitemapGenerator {
  private urls: SitemapUrl[] = [];
  private options: Required<SitemapOptions>;

  constructor(options: SitemapOptions) {
    this.options = {
      baseUrl: options.baseUrl.replace(/\/$/, ''), // Remove trailing slash
      defaultChangefreq: options.defaultChangefreq || 'weekly',
      defaultPriority: options.defaultPriority ?? 0.5,
      prettyPrint: options.prettyPrint ?? true,
    };
  }

  /**
   * Add a URL to the sitemap
   */
  addUrl(url: Omit<SitemapUrl, 'loc'> & { loc: string }): this {
    const fullUrl: SitemapUrl = {
      loc: this.normalizeUrl(url.loc),
      lastmod: url.lastmod,
      changefreq: url.changefreq || this.options.defaultChangefreq,
      priority: url.priority ?? this.options.defaultPriority,
      alternates: url.alternates,
      images: url.images,
    };

    this.urls.push(fullUrl);
    return this;
  }

  /**
   * Add multiple URLs at once
   */
  addUrls(urls: Array<Omit<SitemapUrl, 'loc'> & { loc: string }>): this {
    urls.forEach((url) => this.addUrl(url));
    return this;
  }

  /**
   * Generate XML sitemap
   */
  toXML(): string {
    const indent = this.options.prettyPrint ? '  ' : '';
    const newline = this.options.prettyPrint ? '\n' : '';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>' + newline;
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
    xml += ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
    xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">';
    xml += newline;

    this.urls.forEach((url) => {
      xml += indent + '<url>' + newline;
      xml += indent + indent + `<loc>${this.escapeXml(url.loc)}</loc>` + newline;

      if (url.lastmod) {
        xml += indent + indent + `<lastmod>${url.lastmod}</lastmod>` + newline;
      }

      if (url.changefreq) {
        xml += indent + indent + `<changefreq>${url.changefreq}</changefreq>` + newline;
      }

      if (url.priority !== undefined) {
        xml += indent + indent + `<priority>${url.priority.toFixed(1)}</priority>` + newline;
      }

      // Add alternate language versions
      if (url.alternates && url.alternates.length > 0) {
        url.alternates.forEach((alternate) => {
          xml += indent + indent + '<xhtml:link rel="alternate" ';
          xml += `hreflang="${alternate.hreflang}" `;
          xml += `href="${this.escapeXml(alternate.href)}" />`;
          xml += newline;
        });
      }

      // Add images
      if (url.images && url.images.length > 0) {
        url.images.forEach((image) => {
          xml += indent + indent + '<image:image>' + newline;
          xml +=
            indent +
            indent +
            indent +
            `<image:loc>${this.escapeXml(image.loc)}</image:loc>` +
            newline;

          if (image.caption) {
            xml +=
              indent +
              indent +
              indent +
              `<image:caption>${this.escapeXml(image.caption)}</image:caption>` +
              newline;
          }

          if (image.title) {
            xml +=
              indent +
              indent +
              indent +
              `<image:title>${this.escapeXml(image.title)}</image:title>` +
              newline;
          }

          if (image.geoLocation) {
            xml +=
              indent +
              indent +
              indent +
              `<image:geo_location>${this.escapeXml(image.geoLocation)}</image:geo_location>` +
              newline;
          }

          if (image.license) {
            xml +=
              indent +
              indent +
              indent +
              `<image:license>${this.escapeXml(image.license)}</image:license>` +
              newline;
          }

          xml += indent + indent + '</image:image>' + newline;
        });
      }

      xml += indent + '</url>' + newline;
    });

    xml += '</urlset>';

    return xml;
  }

  /**
   * Get all URLs
   */
  getUrls(): SitemapUrl[] {
    return [...this.urls];
  }

  /**
   * Get URLs count
   */
  getUrlsCount(): number {
    return this.urls.length;
  }

  /**
   * Clear all URLs
   */
  clear(): this {
    this.urls = [];
    return this;
  }

  /**
   * Normalize URL (ensure it's absolute)
   */
  private normalizeUrl(url: string): string {
    // If already absolute, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Ensure leading slash
    const path = url.startsWith('/') ? url : `/${url}`;

    return `${this.options.baseUrl}${path}`;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

/**
 * Sitemap Index Generator
 * For large sites with multiple sitemaps
 */
export class SitemapIndexGenerator {
  private sitemaps: Array<{ loc: string; lastmod?: string }> = [];
  private prettyPrint: boolean;

  constructor(options: { prettyPrint?: boolean } = {}) {
    this.prettyPrint = options.prettyPrint ?? true;
  }

  /**
   * Add a sitemap to the index
   */
  addSitemap(loc: string, lastmod?: string): this {
    this.sitemaps.push({ loc, lastmod });
    return this;
  }

  /**
   * Generate XML sitemap index
   */
  toXML(): string {
    const indent = this.prettyPrint ? '  ' : '';
    const newline = this.prettyPrint ? '\n' : '';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>' + newline;
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    xml += newline;

    this.sitemaps.forEach((sitemap) => {
      xml += indent + '<sitemap>' + newline;
      xml += indent + indent + `<loc>${this.escapeXml(sitemap.loc)}</loc>` + newline;

      if (sitemap.lastmod) {
        xml += indent + indent + `<lastmod>${sitemap.lastmod}</lastmod>` + newline;
      }

      xml += indent + '</sitemap>' + newline;
    });

    xml += '</sitemapindex>';

    return xml;
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

/**
 * Helper function to quickly generate a sitemap
 */
export function generateSitemap(
  urls: Array<Omit<SitemapUrl, 'loc'> & { loc: string }>,
  options: SitemapOptions,
): string {
  const generator = new SitemapGenerator(options);
  generator.addUrls(urls);
  return generator.toXML();
}

/**
 * Helper function to create a sitemap index
 */
export function generateSitemapIndex(
  sitemaps: Array<{ loc: string; lastmod?: string }>,
  options?: { prettyPrint?: boolean },
): string {
  const generator = new SitemapIndexGenerator(options);
  sitemaps.forEach((sitemap) => generator.addSitemap(sitemap.loc, sitemap.lastmod));
  return generator.toXML();
}
