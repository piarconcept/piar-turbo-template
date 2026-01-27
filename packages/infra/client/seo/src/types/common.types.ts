/**
 * Common SEO types and interfaces
 * Following Schema.org and Open Graph Protocol standards
 */

/**
 * Basic SEO metadata for pages
 */
export interface SEOMetadata {
  /** Page title (55-60 characters recommended) */
  title: string;
  /** Meta description (150-160 characters recommended) */
  description: string;
  /** Keywords for the page */
  keywords?: string[];
  /** Canonical URL to prevent duplicate content */
  canonical?: string;
  /** Robots directives */
  robots?: RobotsDirective;
  /** Language of the content (ISO 639-1) */
  language?: string;
  /** Author of the content */
  author?: string;
  /** Publisher of the content */
  publisher?: string;
}

/**
 * Robots meta tag directives
 */
export interface RobotsDirective {
  /** Allow/disallow indexing */
  index?: boolean;
  /** Allow/disallow following links */
  follow?: boolean;
  /** Prevent showing snippet in search results */
  nosnippet?: boolean;
  /** Prevent showing cached version */
  noarchive?: boolean;
  /** Prevent showing image in search results */
  noimageindex?: boolean;
  /** Maximum snippet length (characters) */
  maxSnippet?: number;
  /** Maximum video preview length (seconds) */
  maxVideoPreview?: number;
  /** Maximum image preview size */
  maxImagePreview?: 'none' | 'standard' | 'large';
}

/**
 * Open Graph metadata for social media
 * Based on Open Graph Protocol: https://ogp.me/
 */
export interface OpenGraphMetadata {
  /** The type of your object */
  type: 'website' | 'article' | 'book' | 'profile' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station';
  /** The title of your object */
  title: string;
  /** The description of your object */
  description?: string;
  /** The canonical URL of your object */
  url: string;
  /** Site name */
  siteName?: string;
  /** Locale of the content */
  locale?: string;
  /** Alternate locales */
  alternateLocales?: string[];
  /** Images for the object */
  images?: OpenGraphImage[];
  /** Videos for the object */
  videos?: OpenGraphVideo[];
  /** Audio for the object */
  audio?: OpenGraphAudio[];
}

/**
 * Open Graph image properties
 */
export interface OpenGraphImage {
  /** URL of the image */
  url: string;
  /** Secure URL (https) of the image */
  secureUrl?: string;
  /** MIME type of the image */
  type?: string;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Alt text for the image */
  alt?: string;
}

/**
 * Open Graph video properties
 */
export interface OpenGraphVideo {
  /** URL of the video */
  url: string;
  /** Secure URL (https) of the video */
  secureUrl?: string;
  /** MIME type of the video */
  type?: string;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
}

/**
 * Open Graph audio properties
 */
export interface OpenGraphAudio {
  /** URL of the audio */
  url: string;
  /** Secure URL (https) of the audio */
  secureUrl?: string;
  /** MIME type of the audio */
  type?: string;
}

/**
 * Article-specific Open Graph metadata
 */
export interface OpenGraphArticle {
  /** When the article was published (ISO 8601) */
  publishedTime?: string;
  /** When the article was last modified (ISO 8601) */
  modifiedTime?: string;
  /** When the article is out of date (ISO 8601) */
  expirationTime?: string;
  /** Authors of the article */
  authors?: string[];
  /** Section the article belongs to */
  section?: string;
  /** Tags associated with the article */
  tags?: string[];
}

/**
 * Twitter Card metadata
 * Based on Twitter Card documentation
 */
export interface TwitterCardMetadata {
  /** The card type */
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  /** Twitter @username of content creator */
  creator?: string;
  /** Twitter @username of website */
  site?: string;
  /** Title (70 characters max) */
  title?: string;
  /** Description (200 characters max) */
  description?: string;
  /** Image URL */
  image?: string;
  /** Alt text for image */
  imageAlt?: string;
}

/**
 * Sitemap URL entry
 */
export interface SitemapUrl {
  /** URL of the page */
  loc: string;
  /** Last modification date (ISO 8601) */
  lastmod?: string;
  /** Change frequency */
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** Priority (0.0 to 1.0) */
  priority?: number;
  /** Alternate language versions */
  alternates?: SitemapAlternate[];
  /** Images in the page */
  images?: SitemapImage[];
}

/**
 * Alternate language version for sitemap
 */
export interface SitemapAlternate {
  /** Language code (ISO 639-1) */
  hreflang: string;
  /** URL of the alternate version */
  href: string;
}

/**
 * Image entry for sitemap
 */
export interface SitemapImage {
  /** URL of the image */
  loc: string;
  /** Caption of the image */
  caption?: string;
  /** Title of the image */
  title?: string;
  /** Geographic location of the image */
  geoLocation?: string;
  /** License URL */
  license?: string;
}

/**
 * Complete SEO configuration for a page
 */
export interface PageSEOConfig {
  /** Basic metadata */
  metadata: SEOMetadata;
  /** Open Graph data */
  openGraph?: OpenGraphMetadata;
  /** Article-specific Open Graph data */
  article?: OpenGraphArticle;
  /** Twitter Card data */
  twitter?: TwitterCardMetadata;
  /** Structured data (JSON-LD) */
  structuredData?: Record<string, unknown>[];
}
