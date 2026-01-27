/**
 * Robots.txt generator
 * Creates robots.txt files for controlling web crawler access
 */

/**
 * Robots.txt rule for a specific user agent
 */
export interface RobotRule {
  /** User agent (bot name) or '*' for all */
  userAgent: string;
  /** Paths to allow */
  allow?: string[];
  /** Paths to disallow */
  disallow?: string[];
  /** Crawl delay in seconds */
  crawlDelay?: number;
}

/**
 * Robots.txt options
 */
export interface RobotsOptions {
  /** Rules for different user agents */
  rules: RobotRule[];
  /** Sitemap URLs */
  sitemaps?: string[];
  /** Host directive (specify preferred domain) */
  host?: string;
  /** Additional custom directives */
  custom?: string[];
}

/**
 * RobotsGenerator - Creates robots.txt content
 * 
 * @example
 * ```typescript
 * const generator = new RobotsGenerator();
 * 
 * generator
 *   .addRule({
 *     userAgent: '*',
 *     allow: ['/'],
 *     disallow: ['/admin', '/api']
 *   })
 *   .addSitemap('https://example.com/sitemap.xml');
 * 
 * const robotsTxt = generator.build();
 * ```
 */
export class RobotsGenerator {
  private rules: RobotRule[] = [];
  private sitemaps: string[] = [];
  private host?: string;
  private custom: string[] = [];

  /**
   * Add a rule for a user agent
   */
  addRule(rule: RobotRule): this {
    this.rules.push(rule);
    return this;
  }

  /**
   * Add multiple rules
   */
  addRules(rules: RobotRule[]): this {
    rules.forEach((rule) => this.addRule(rule));
    return this;
  }

  /**
   * Add sitemap URL
   */
  addSitemap(url: string): this {
    this.sitemaps.push(url);
    return this;
  }

  /**
   * Add multiple sitemap URLs
   */
  addSitemaps(urls: string[]): this {
    urls.forEach((url) => this.addSitemap(url));
    return this;
  }

  /**
   * Set host directive
   */
  setHost(host: string): this {
    this.host = host;
    return this;
  }

  /**
   * Add custom directive
   */
  addCustomDirective(directive: string): this {
    this.custom.push(directive);
    return this;
  }

  /**
   * Build robots.txt content
   */
  build(): string {
    let content = '';

    // Add rules
    this.rules.forEach((rule) => {
      content += `User-agent: ${rule.userAgent}\n`;

      if (rule.allow && rule.allow.length > 0) {
        rule.allow.forEach((path) => {
          content += `Allow: ${path}\n`;
        });
      }

      if (rule.disallow && rule.disallow.length > 0) {
        rule.disallow.forEach((path) => {
          content += `Disallow: ${path}\n`;
        });
      }

      if (rule.crawlDelay !== undefined) {
        content += `Crawl-delay: ${rule.crawlDelay}\n`;
      }

      content += '\n';
    });

    // Add host directive
    if (this.host) {
      content += `Host: ${this.host}\n\n`;
    }

    // Add sitemaps
    if (this.sitemaps.length > 0) {
      this.sitemaps.forEach((sitemap) => {
        content += `Sitemap: ${sitemap}\n`;
      });
      content += '\n';
    }

    // Add custom directives
    if (this.custom.length > 0) {
      this.custom.forEach((directive) => {
        content += `${directive}\n`;
      });
    }

    return content.trim();
  }

  /**
   * Reset the generator
   */
  reset(): this {
    this.rules = [];
    this.sitemaps = [];
    this.host = undefined;
    this.custom = [];
    return this;
  }
}

/**
 * Predefined robots.txt templates
 */
export class RobotsTemplates {
  /**
   * Allow all bots to crawl everything
   */
  static allowAll(sitemaps?: string[]): string {
    const generator = new RobotsGenerator();

    generator.addRule({
      userAgent: '*',
      allow: ['/'],
    });

    if (sitemaps) {
      generator.addSitemaps(sitemaps);
    }

    return generator.build();
  }

  /**
   * Disallow all bots (useful for staging/dev environments)
   */
  static disallowAll(): string {
    const generator = new RobotsGenerator();

    generator.addRule({
      userAgent: '*',
      disallow: ['/'],
    });

    return generator.build();
  }

  /**
   * Standard production configuration
   * Allows all except admin/api paths
   */
  static standardProduction(options: {
    sitemaps: string[];
    host?: string;
    disallowPaths?: string[];
  }): string {
    const generator = new RobotsGenerator();

    const disallow = options.disallowPaths || [
      '/admin',
      '/api',
      '/private',
      '/_next',
      '/static',
    ];

    generator.addRule({
      userAgent: '*',
      allow: ['/'],
      disallow,
    });

    generator.addSitemaps(options.sitemaps);

    if (options.host) {
      generator.setHost(options.host);
    }

    return generator.build();
  }

  /**
   * Configuration for e-commerce sites
   */
  static ecommerce(options: {
    sitemaps: string[];
    host?: string;
  }): string {
    const generator = new RobotsGenerator();

    // Allow all except sensitive paths
    generator.addRule({
      userAgent: '*',
      allow: ['/'],
      disallow: [
        '/admin',
        '/api',
        '/cart',
        '/checkout',
        '/account',
        '/orders',
        '/_next',
        '/static',
      ],
    });

    // Specific rules for search engines
    generator.addRule({
      userAgent: 'Googlebot',
      allow: ['/'],
      disallow: ['/admin', '/api', '/checkout', '/account'],
    });

    generator.addSitemaps(options.sitemaps);

    if (options.host) {
      generator.setHost(options.host);
    }

    return generator.build();
  }

  /**
   * Configuration for blogs
   */
  static blog(options: {
    sitemaps: string[];
    host?: string;
  }): string {
    const generator = new RobotsGenerator();

    generator.addRule({
      userAgent: '*',
      allow: ['/'],
      disallow: [
        '/admin',
        '/api',
        '/draft',
        '/private',
        '/_next',
        '/static',
      ],
    });

    generator.addSitemaps(options.sitemaps);

    if (options.host) {
      generator.setHost(options.host);
    }

    return generator.build();
  }

  /**
   * Block specific bad bots
   */
  static blockBadBots(goodBotsConfig: RobotRule): string {
    const generator = new RobotsGenerator();

    // Block known bad bots
    const badBots = [
      'AhrefsBot',
      'SemrushBot',
      'DotBot',
      'MJ12bot',
      'BLEXBot',
      'PetalBot',
    ];

    badBots.forEach((bot) => {
      generator.addRule({
        userAgent: bot,
        disallow: ['/'],
      });
    });

    // Allow good bots
    generator.addRule(goodBotsConfig);

    return generator.build();
  }
}

/**
 * Helper function to quickly generate robots.txt
 */
export function generateRobotsTxt(options: RobotsOptions): string {
  const generator = new RobotsGenerator();

  generator.addRules(options.rules);

  if (options.sitemaps) {
    generator.addSitemaps(options.sitemaps);
  }

  if (options.host) {
    generator.setHost(options.host);
  }

  if (options.custom) {
    options.custom.forEach((directive) => {
      generator.addCustomDirective(directive);
    });
  }

  return generator.build();
}
