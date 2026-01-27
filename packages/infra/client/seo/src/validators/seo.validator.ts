/**
 * SEO validators
 * Validate SEO metadata and provide recommendations
 */

import type { SEOMetadata, OpenGraphMetadata, TwitterCardMetadata } from '../types/common.types';
import { validateMetaDescription, validateTitle } from '../utils/seo.utils';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

/**
 * SEOValidator - Validates SEO metadata
 * 
 * @example
 * ```typescript
 * const validator = new SEOValidator();
 * const result = validator.validateMetadata({
 *   title: 'My Page',
 *   description: 'Short',
 *   canonical: 'https://example.com/page'
 * });
 * ```
 */
export class SEOValidator {
  /**
   * Validate basic SEO metadata
   */
  validateMetadata(metadata: SEOMetadata): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Title validation
    if (!metadata.title) {
      errors.push('Title is required');
    } else {
      const titleValidation = validateTitle(metadata.title);
      if (!titleValidation.valid) {
        warnings.push(`Title: ${titleValidation.recommendation}`);
      }
    }

    // Description validation
    if (!metadata.description) {
      errors.push('Description is required');
    } else {
      const descValidation = validateMetaDescription(metadata.description);
      if (!descValidation.valid) {
        warnings.push(`Description: ${descValidation.recommendation}`);
      }
    }

    // Canonical URL validation
    if (!metadata.canonical) {
      warnings.push('Canonical URL is recommended to prevent duplicate content issues');
    } else {
      try {
        new URL(metadata.canonical);
      } catch {
        errors.push('Canonical URL is not a valid URL');
      }
    }

    // Keywords validation
    if (!metadata.keywords || metadata.keywords.length === 0) {
      recommendations.push('Consider adding keywords for better SEO');
    } else if (metadata.keywords.length > 10) {
      warnings.push('Too many keywords. Keep it to 5-10 relevant keywords');
    }

    // Robots validation
    if (metadata.robots?.index === false) {
      recommendations.push('Page is set to noindex - ensure this is intentional');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Validate Open Graph metadata
   */
  validateOpenGraph(og: OpenGraphMetadata): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Type validation
    if (!og.type) {
      errors.push('Open Graph type is required');
    }

    // Title validation
    if (!og.title) {
      errors.push('Open Graph title is required');
    }

    // URL validation
    if (!og.url) {
      errors.push('Open Graph URL is required');
    } else {
      try {
        new URL(og.url);
      } catch {
        errors.push('Open Graph URL is not a valid URL');
      }
    }

    // Description validation
    if (!og.description) {
      recommendations.push('Open Graph description is recommended for better social sharing');
    }

    // Images validation
    if (!og.images || og.images.length === 0) {
      warnings.push('Open Graph image is highly recommended for social media sharing');
    } else {
      og.images.forEach((image, index) => {
        try {
          new URL(image.url);
        } catch {
          errors.push(`Open Graph image ${index + 1}: Invalid URL`);
        }

        // Image dimensions validation
        if (!image.width || !image.height) {
          warnings.push(
            `Open Graph image ${index + 1}: Width and height are recommended (recommended: 1200x630)`
          );
        } else {
          // Check for recommended dimensions
          if (image.width < 1200 || image.height < 630) {
            recommendations.push(
              `Open Graph image ${index + 1}: Consider using at least 1200x630 for better quality`
            );
          }

          // Check aspect ratio
          const ratio = image.width / image.height;
          if (ratio < 1.9 || ratio > 1.91) {
            recommendations.push(
              `Open Graph image ${index + 1}: Recommended aspect ratio is 1.91:1 (1200x630)`
            );
          }
        }

        // Alt text validation
        if (!image.alt) {
          recommendations.push(
            `Open Graph image ${index + 1}: Alt text is recommended for accessibility`
          );
        }
      });
    }

    // Site name validation
    if (!og.siteName) {
      recommendations.push('Open Graph site_name is recommended');
    }

    // Locale validation
    if (!og.locale) {
      recommendations.push('Open Graph locale is recommended for international sites');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Validate Twitter Card metadata
   */
  validateTwitterCard(twitter: TwitterCardMetadata): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Card type validation
    if (!twitter.card) {
      errors.push('Twitter card type is required');
    }

    // Title validation
    if (!twitter.title) {
      warnings.push('Twitter title is recommended (falls back to og:title)');
    } else if (twitter.title.length > 70) {
      warnings.push('Twitter title should be 70 characters or less');
    }

    // Description validation
    if (!twitter.description) {
      warnings.push('Twitter description is recommended (falls back to og:description)');
    } else if (twitter.description.length > 200) {
      warnings.push('Twitter description should be 200 characters or less');
    }

    // Image validation
    if (!twitter.image) {
      warnings.push('Twitter image is highly recommended for better engagement');
    } else {
      try {
        new URL(twitter.image);
      } catch {
        errors.push('Twitter image URL is not valid');
      }

      // Image alt validation
      if (!twitter.imageAlt) {
        recommendations.push('Twitter image alt text is recommended for accessibility');
      }
    }

    // Creator validation
    if (!twitter.creator) {
      recommendations.push('Twitter creator (@username) is recommended for attribution');
    } else if (!twitter.creator.startsWith('@')) {
      warnings.push('Twitter creator should start with @');
    }

    // Site validation
    if (!twitter.site) {
      recommendations.push('Twitter site (@username) is recommended');
    } else if (!twitter.site.startsWith('@')) {
      warnings.push('Twitter site should start with @');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * Validate all SEO elements together
   */
  validateAll(data: {
    metadata: SEOMetadata;
    openGraph?: OpenGraphMetadata;
    twitter?: TwitterCardMetadata;
  }): ValidationResult {
    const results: ValidationResult[] = [];

    // Validate basic metadata
    results.push(this.validateMetadata(data.metadata));

    // Validate Open Graph if provided
    if (data.openGraph) {
      results.push(this.validateOpenGraph(data.openGraph));
    } else {
      results.push({
        valid: false,
        errors: [],
        warnings: ['Open Graph metadata is missing - highly recommended for social sharing'],
        recommendations: [],
      });
    }

    // Validate Twitter Card if provided
    if (data.twitter) {
      results.push(this.validateTwitterCard(data.twitter));
    } else {
      results.push({
        valid: true,
        errors: [],
        warnings: [],
        recommendations: ['Twitter Card metadata is recommended for better Twitter sharing'],
      });
    }

    // Combine results
    const combined: ValidationResult = {
      valid: results.every((r) => r.valid),
      errors: results.flatMap((r) => r.errors),
      warnings: results.flatMap((r) => r.warnings),
      recommendations: results.flatMap((r) => r.recommendations),
    };

    return combined;
  }

  /**
   * Get SEO score (0-100)
   */
  calculateScore(data: {
    metadata: SEOMetadata;
    openGraph?: OpenGraphMetadata;
    twitter?: TwitterCardMetadata;
  }): number {
    const validation = this.validateAll(data);

    let score = 100;

    // Deduct points for errors
    score -= validation.errors.length * 20;

    // Deduct points for warnings
    score -= validation.warnings.length * 10;

    // Deduct points for missing recommendations
    score -= validation.recommendations.length * 5;

    return Math.max(0, score);
  }

  /**
   * Get recommendations for improving SEO
   */
  getImprovements(data: {
    metadata: SEOMetadata;
    openGraph?: OpenGraphMetadata;
    twitter?: TwitterCardMetadata;
  }): string[] {
    const validation = this.validateAll(data);
    return [
      ...validation.errors.map((e) => `❌ ${e}`),
      ...validation.warnings.map((w) => `⚠️ ${w}`),
      ...validation.recommendations.map((r) => `💡 ${r}`),
    ];
  }
}

/**
 * Quick validation function
 */
export function validateSEO(data: {
  metadata: SEOMetadata;
  openGraph?: OpenGraphMetadata;
  twitter?: TwitterCardMetadata;
}): ValidationResult {
  const validator = new SEOValidator();
  return validator.validateAll(data);
}

/**
 * Quick SEO score function
 */
export function calculateSEOScore(data: {
  metadata: SEOMetadata;
  openGraph?: OpenGraphMetadata;
  twitter?: TwitterCardMetadata;
}): number {
  const validator = new SEOValidator();
  return validator.calculateScore(data);
}
