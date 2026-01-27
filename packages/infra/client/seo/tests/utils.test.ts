import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  truncateText,
  generateMetaDescription,
  createSlug,
  generateCanonicalUrl,
  isValidUrl,
  calculateReadingTime,
  validateMetaDescription,
  validateTitle,
  getCurrentISODate,
  extractKeywords,
} from '../src/utils/seo.utils';

describe('SEO Utils - Text Processing', () => {
  describe('sanitizeText', () => {
    it('should remove extra whitespace', () => {
      expect(sanitizeText('  hello  world  ')).toBe('hello world');
    });

    it('should handle empty string', () => {
      expect(sanitizeText('')).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const long = 'This is a very long text that needs to be truncated';
      const result = truncateText(long, 20);
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
    });

    it('should not truncate short text', () => {
      const short = 'Short';
      expect(truncateText(short, 20)).toBe('Short');
    });
  });

  describe('generateMetaDescription', () => {
    it('should generate description from text', () => {
      const text = 'This is some content. '.repeat(10);
      const result = generateMetaDescription(text);
      expect(result.length).toBeLessThanOrEqual(160);
    });
  });

  describe('createSlug', () => {
    it('should create lowercase slug', () => {
      expect(createSlug('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(createSlug('Hello@World!')).toMatch(/^[a-z0-9-]+$/);
    });

    it('should handle spaces and hyphens', () => {
      expect(createSlug('Hello - World')).toBe('hello-world');
    });
  });

  describe('extractKeywords', () => {
    it('should extract keywords from text', () => {
      const text = 'Hello world, this is a test text for keyword extraction';
      const keywords = extractKeywords(text, 3);
      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords.length).toBeLessThanOrEqual(3);
    });
  });
});

describe('SEO Utils - URL Processing', () => {
  describe('generateCanonicalUrl', () => {
    it('should generate canonical URL', () => {
      const result = generateCanonicalUrl('https://example.com', '/page');
      expect(result).toBe('https://example.com/page');
    });

    it('should remove trailing slash from base', () => {
      const result = generateCanonicalUrl('https://example.com/', '/page');
      expect(result).toBe('https://example.com/page');
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://test.org/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });
});

describe('SEO Utils - Validation', () => {
  describe('validateMetaDescription', () => {
    it('should validate good description', () => {
      const desc = 'This is a good meta description with proper length for SEO purposes and search engines';
      const result = validateMetaDescription(desc);
      expect(result.valid).toBe(true);
    });

    it('should detect too short description', () => {
      const result = validateMetaDescription('Too short');
      expect(result.valid).toBe(false);
    });

    it('should detect too long description', () => {
      const long = 'A'.repeat(200);
      const result = validateMetaDescription(long);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateTitle', () => {
    it('should validate good title', () => {
      const result = validateTitle('This is a good SEO title for search');
      expect(result.valid).toBe(true);
    });

    it('should detect too short title', () => {
      const result = validateTitle('Short');
      expect(result.valid).toBe(false);
    });

    it('should detect too long title', () => {
      const long = 'A'.repeat(80);
      const result = validateTitle(long);
      expect(result.valid).toBe(false);
    });
  });
});

describe('SEO Utils - Miscellaneous', () => {
  describe('calculateReadingTime', () => {
    it('should calculate reading time', () => {
      const text = 'word '.repeat(200); // 200 words
      const minutes = calculateReadingTime(text);
      expect(minutes).toBeGreaterThan(0);
      expect(typeof minutes).toBe('number');
    });

    it('should handle empty text', () => {
      expect(calculateReadingTime('')).toBe(1);
    });
  });

  describe('getCurrentISODate', () => {
    it('should return ISO date string', () => {
      const result = getCurrentISODate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
