/**
 * @piar/infra-client-seo
 * Comprehensive SEO infrastructure for client applications
 *
 * This package provides professional-grade SEO tools including:
 * - Meta tags builders (Open Graph, Twitter Cards)
 * - Schema.org JSON-LD structured data
 * - Sitemap generators
 * - Robots.txt builders
 * - SEO validators and utilities
 *
 * @example
 * ```typescript
 * import { MetaTagsBuilder, SchemaBuilder, createMetaTags } from '@piar/infra-client-seo';
 *
 * // Quick meta tags
 * const tags = createMetaTags({
 *   metadata: {
 *     title: 'My Page',
 *     description: 'Page description'
 *   }
 * });
 *
 * // Schema.org structured data
 * const schema = SchemaBuilder.article({
 *   headline: 'Article Title',
 *   author: { name: 'John Doe' }
 * });
 * ```
 */

// Types
export * from './types/common.types';
export * from './types/schema.types';

// Builders
export * from './builders/meta-tags.builder';
export * from './builders/schema.builder';

// Generators
export * from './generators/sitemap.generator';
export * from './generators/robots.generator';

// Utilities
export * from './utils/seo.utils';

// Validators
export * from './validators/seo.validator';
