/**
 * Meta tags builder for HTML head
 * Generates all necessary meta tags for SEO optimization
 */

import type {
  SEOMetadata,
  RobotsDirective,
  OpenGraphMetadata,
  OpenGraphArticle,
  TwitterCardMetadata,
} from '../types/common.types';

/**
 * Meta tag representation
 */
export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
  charset?: string;
}

/**
 * Link tag representation
 */
export interface LinkTag {
  rel: string;
  href: string;
  hreflang?: string;
  type?: string;
  sizes?: string;
}

/**
 * MetaTagsBuilder - Constructs all SEO meta tags
 * 
 * @example
 * ```typescript
 * const builder = new MetaTagsBuilder();
 * const tags = builder
 *   .setBasicMetadata({
 *     title: 'My Page',
 *     description: 'Page description',
 *     canonical: 'https://example.com/page'
 *   })
 *   .setOpenGraph({
 *     type: 'website',
 *     title: 'My Page',
 *     url: 'https://example.com/page'
 *   })
 *   .build();
 * ```
 */
export class MetaTagsBuilder {
  private metaTags: MetaTag[] = [];
  private linkTags: LinkTag[] = [];

  /**
   * Set basic SEO metadata
   */
  setBasicMetadata(metadata: SEOMetadata): this {
    // Title is handled separately in Next.js/HTML
    
    // Description
    if (metadata.description) {
      this.metaTags.push({
        name: 'description',
        content: metadata.description,
      });
    }

    // Keywords
    if (metadata.keywords && metadata.keywords.length > 0) {
      this.metaTags.push({
        name: 'keywords',
        content: metadata.keywords.join(', '),
      });
    }

    // Canonical URL
    if (metadata.canonical) {
      this.linkTags.push({
        rel: 'canonical',
        href: metadata.canonical,
      });
    }

    // Robots
    if (metadata.robots) {
      this.metaTags.push({
        name: 'robots',
        content: this.buildRobotsContent(metadata.robots),
      });
    }

    // Language
    if (metadata.language) {
      this.metaTags.push({
        httpEquiv: 'content-language',
        content: metadata.language,
      });
    }

    // Author
    if (metadata.author) {
      this.metaTags.push({
        name: 'author',
        content: metadata.author,
      });
    }

    // Publisher
    if (metadata.publisher) {
      this.metaTags.push({
        name: 'publisher',
        content: metadata.publisher,
      });
    }

    return this;
  }

  /**
   * Set Open Graph metadata
   */
  setOpenGraph(og: OpenGraphMetadata): this {
    // Type
    this.metaTags.push({
      property: 'og:type',
      content: og.type,
    });

    // Title
    this.metaTags.push({
      property: 'og:title',
      content: og.title,
    });

    // Description
    if (og.description) {
      this.metaTags.push({
        property: 'og:description',
        content: og.description,
      });
    }

    // URL
    this.metaTags.push({
      property: 'og:url',
      content: og.url,
    });

    // Site name
    if (og.siteName) {
      this.metaTags.push({
        property: 'og:site_name',
        content: og.siteName,
      });
    }

    // Locale
    if (og.locale) {
      this.metaTags.push({
        property: 'og:locale',
        content: og.locale,
      });
    }

    // Alternate locales
    if (og.alternateLocales) {
      og.alternateLocales.forEach((locale) => {
        this.metaTags.push({
          property: 'og:locale:alternate',
          content: locale,
        });
      });
    }

    // Images
    if (og.images) {
      og.images.forEach((image) => {
        this.metaTags.push({
          property: 'og:image',
          content: image.url,
        });

        if (image.secureUrl) {
          this.metaTags.push({
            property: 'og:image:secure_url',
            content: image.secureUrl,
          });
        }

        if (image.type) {
          this.metaTags.push({
            property: 'og:image:type',
            content: image.type,
          });
        }

        if (image.width) {
          this.metaTags.push({
            property: 'og:image:width',
            content: image.width.toString(),
          });
        }

        if (image.height) {
          this.metaTags.push({
            property: 'og:image:height',
            content: image.height.toString(),
          });
        }

        if (image.alt) {
          this.metaTags.push({
            property: 'og:image:alt',
            content: image.alt,
          });
        }
      });
    }

    // Videos
    if (og.videos) {
      og.videos.forEach((video) => {
        this.metaTags.push({
          property: 'og:video',
          content: video.url,
        });

        if (video.secureUrl) {
          this.metaTags.push({
            property: 'og:video:secure_url',
            content: video.secureUrl,
          });
        }

        if (video.type) {
          this.metaTags.push({
            property: 'og:video:type',
            content: video.type,
          });
        }

        if (video.width) {
          this.metaTags.push({
            property: 'og:video:width',
            content: video.width.toString(),
          });
        }

        if (video.height) {
          this.metaTags.push({
            property: 'og:video:height',
            content: video.height.toString(),
          });
        }
      });
    }

    // Audio
    if (og.audio) {
      og.audio.forEach((audio) => {
        this.metaTags.push({
          property: 'og:audio',
          content: audio.url,
        });

        if (audio.secureUrl) {
          this.metaTags.push({
            property: 'og:audio:secure_url',
            content: audio.secureUrl,
          });
        }

        if (audio.type) {
          this.metaTags.push({
            property: 'og:audio:type',
            content: audio.type,
          });
        }
      });
    }

    return this;
  }

  /**
   * Set article-specific Open Graph metadata
   */
  setArticle(article: OpenGraphArticle): this {
    if (article.publishedTime) {
      this.metaTags.push({
        property: 'article:published_time',
        content: article.publishedTime,
      });
    }

    if (article.modifiedTime) {
      this.metaTags.push({
        property: 'article:modified_time',
        content: article.modifiedTime,
      });
    }

    if (article.expirationTime) {
      this.metaTags.push({
        property: 'article:expiration_time',
        content: article.expirationTime,
      });
    }

    if (article.authors) {
      article.authors.forEach((author) => {
        this.metaTags.push({
          property: 'article:author',
          content: author,
        });
      });
    }

    if (article.section) {
      this.metaTags.push({
        property: 'article:section',
        content: article.section,
      });
    }

    if (article.tags) {
      article.tags.forEach((tag) => {
        this.metaTags.push({
          property: 'article:tag',
          content: tag,
        });
      });
    }

    return this;
  }

  /**
   * Set Twitter Card metadata
   */
  setTwitterCard(twitter: TwitterCardMetadata): this {
    // Card type
    this.metaTags.push({
      name: 'twitter:card',
      content: twitter.card,
    });

    // Site
    if (twitter.site) {
      this.metaTags.push({
        name: 'twitter:site',
        content: twitter.site,
      });
    }

    // Creator
    if (twitter.creator) {
      this.metaTags.push({
        name: 'twitter:creator',
        content: twitter.creator,
      });
    }

    // Title
    if (twitter.title) {
      this.metaTags.push({
        name: 'twitter:title',
        content: twitter.title,
      });
    }

    // Description
    if (twitter.description) {
      this.metaTags.push({
        name: 'twitter:description',
        content: twitter.description,
      });
    }

    // Image
    if (twitter.image) {
      this.metaTags.push({
        name: 'twitter:image',
        content: twitter.image,
      });
    }

    // Image alt
    if (twitter.imageAlt) {
      this.metaTags.push({
        name: 'twitter:image:alt',
        content: twitter.imageAlt,
      });
    }

    return this;
  }

  /**
   * Add alternate language versions
   */
  addAlternateLanguages(alternates: Array<{ lang: string; url: string }>): this {
    alternates.forEach(({ lang, url }) => {
      this.linkTags.push({
        rel: 'alternate',
        hreflang: lang,
        href: url,
      });
    });

    return this;
  }

  /**
   * Add viewport meta tag
   */
  setViewport(viewport: string = 'width=device-width, initial-scale=1'): this {
    this.metaTags.push({
      name: 'viewport',
      content: viewport,
    });

    return this;
  }

  /**
   * Add theme color for mobile browsers
   */
  setThemeColor(color: string): this {
    this.metaTags.push({
      name: 'theme-color',
      content: color,
    });

    return this;
  }

  /**
   * Add favicon links
   */
  setFavicons(options: {
    icon?: string;
    appleTouchIcon?: string;
    manifest?: string;
  }): this {
    if (options.icon) {
      this.linkTags.push({
        rel: 'icon',
        href: options.icon,
      });
    }

    if (options.appleTouchIcon) {
      this.linkTags.push({
        rel: 'apple-touch-icon',
        href: options.appleTouchIcon,
      });
    }

    if (options.manifest) {
      this.linkTags.push({
        rel: 'manifest',
        href: options.manifest,
      });
    }

    return this;
  }

  /**
   * Build and return all tags
   */
  build(): { meta: MetaTag[]; link: LinkTag[] } {
    return {
      meta: this.metaTags,
      link: this.linkTags,
    };
  }

  /**
   * Build robots content string
   */
  private buildRobotsContent(robots: RobotsDirective): string {
    const directives: string[] = [];

    if (robots.index !== undefined) {
      directives.push(robots.index ? 'index' : 'noindex');
    }

    if (robots.follow !== undefined) {
      directives.push(robots.follow ? 'follow' : 'nofollow');
    }

    if (robots.nosnippet) {
      directives.push('nosnippet');
    }

    if (robots.noarchive) {
      directives.push('noarchive');
    }

    if (robots.noimageindex) {
      directives.push('noimageindex');
    }

    if (robots.maxSnippet !== undefined) {
      directives.push(`max-snippet:${robots.maxSnippet}`);
    }

    if (robots.maxVideoPreview !== undefined) {
      directives.push(`max-video-preview:${robots.maxVideoPreview}`);
    }

    if (robots.maxImagePreview) {
      directives.push(`max-image-preview:${robots.maxImagePreview}`);
    }

    return directives.join(', ');
  }

  /**
   * Reset the builder
   */
  reset(): this {
    this.metaTags = [];
    this.linkTags = [];
    return this;
  }
}

/**
 * Helper function to quickly create meta tags
 */
export function createMetaTags(options: {
  metadata: SEOMetadata;
  openGraph?: OpenGraphMetadata;
  article?: OpenGraphArticle;
  twitter?: TwitterCardMetadata;
  alternates?: Array<{ lang: string; url: string }>;
}): { meta: MetaTag[]; link: LinkTag[] } {
  const builder = new MetaTagsBuilder();

  builder.setBasicMetadata(options.metadata);

  if (options.openGraph) {
    builder.setOpenGraph(options.openGraph);
  }

  if (options.article) {
    builder.setArticle(options.article);
  }

  if (options.twitter) {
    builder.setTwitterCard(options.twitter);
  }

  if (options.alternates) {
    builder.addAlternateLanguages(options.alternates);
  }

  return builder.build();
}
