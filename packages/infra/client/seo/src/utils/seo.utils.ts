/**
 * SEO utilities and helpers
 */

/**
 * Sanitize text for SEO (remove HTML, trim, normalize whitespace)
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Truncate text to a specific length for meta descriptions
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  const sanitized = sanitizeText(text);

  if (sanitized.length <= maxLength) {
    return sanitized;
  }

  // Find the last space before maxLength
  const truncated = sanitized.substring(0, maxLength - suffix.length);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + suffix;
  }

  return truncated + suffix;
}

/**
 * Generate a meta description from content
 */
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  return truncateText(content, maxLength);
}

/**
 * Generate keywords from text (extract most common words)
 */
export function extractKeywords(
  text: string,
  maxKeywords: number = 10,
  minWordLength: number = 4,
): string[] {
  const sanitized = sanitizeText(text).toLowerCase();

  // Common stop words to exclude
  const stopWords = new Set([
    'the',
    'and',
    'for',
    'are',
    'but',
    'not',
    'you',
    'all',
    'can',
    'her',
    'was',
    'one',
    'our',
    'out',
    'that',
    'this',
    'with',
    'from',
    'have',
    'has',
    'had',
    'will',
    'would',
    'could',
    'should',
    'been',
    'were',
    'they',
    'their',
    'there',
    'what',
    'when',
    'where',
    'which',
    'who',
    'whom',
    'why',
    'how',
  ]);

  // Extract words
  const words = sanitized
    .split(/\W+/)
    .filter((word) => word.length >= minWordLength && !stopWords.has(word));

  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach((word) => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Sort by frequency and return top keywords
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Create a slug from text (URL-friendly string)
 */
export function createSlug(text: string): string {
  return sanitizeText(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a canonical URL
 */
export function generateCanonicalUrl(baseUrl: string, path: string): string {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${cleanBase}${cleanPath}`;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current ISO date string (for lastmod in sitemaps)
 */
export function getCurrentISODate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Format date to ISO 8601 (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Calculate reading time for content (in minutes)
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const words = sanitizeText(content).split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate Open Graph image URL with fallback
 */
export function generateOgImageUrl(imageUrl: string | undefined, fallbackUrl: string): string {
  if (!imageUrl) {
    return fallbackUrl;
  }

  // If relative URL, make it absolute
  if (!imageUrl.startsWith('http')) {
    return fallbackUrl;
  }

  return imageUrl;
}

/**
 * Validate meta description length
 */
export function validateMetaDescription(description: string): {
  valid: boolean;
  length: number;
  recommendation: string;
} {
  const length = description.length;
  const ideal = { min: 150, max: 160 };

  let valid = true;
  let recommendation = 'Perfect length!';

  if (length < 50) {
    valid = false;
    recommendation = 'Too short. Aim for at least 150 characters.';
  } else if (length < ideal.min) {
    recommendation = `Good, but could be longer. Aim for ${ideal.min}-${ideal.max} characters.`;
  } else if (length > 160) {
    valid = false;
    recommendation = 'Too long. May be truncated in search results. Keep under 160 characters.';
  }

  return { valid, length, recommendation };
}

/**
 * Validate title length
 */
export function validateTitle(title: string): {
  valid: boolean;
  length: number;
  recommendation: string;
} {
  const length = title.length;
  const ideal = { min: 50, max: 60 };

  let valid = true;
  let recommendation = 'Perfect length!';

  if (length < 30) {
    valid = false;
    recommendation = 'Too short. Aim for at least 50 characters.';
  } else if (length < ideal.min) {
    recommendation = `Good, but could be longer. Aim for ${ideal.min}-${ideal.max} characters.`;
  } else if (length > 60) {
    valid = false;
    recommendation = 'Too long. May be truncated in search results. Keep under 60 characters.';
  }

  return { valid, length, recommendation };
}

/**
 * Remove duplicate slashes from URL path
 */
export function normalizePath(path: string): string {
  return path.replace(/\/+/g, '/');
}

/**
 * Ensure URL has protocol
 */
export function ensureProtocol(url: string, defaultProtocol: string = 'https'): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return `${defaultProtocol}://${url}`;
}

/**
 * Get domain from URL
 */
export function getDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Check if URL is external
 */
export function isExternalUrl(url: string, currentDomain: string): boolean {
  const domain = getDomain(url);
  return domain !== null && domain !== currentDomain;
}

/**
 * Generate hreflang code from locale
 */
export function generateHreflang(locale: string): string {
  // Convert locale like 'en-US' to 'en-us' (lowercase)
  return locale.toLowerCase();
}

/**
 * Parse hreflang to locale
 */
export function parseHreflang(hreflang: string): { language: string; region?: string } {
  const parts = hreflang.split('-');
  return {
    language: parts[0],
    region: parts[1],
  };
}
