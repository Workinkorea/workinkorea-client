import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMetadata, siteConfig, defaultMetadata } from '../metadata';

// Mock next module (Metadata is only used as a type at runtime)
vi.mock('next', () => ({}));

describe('createMetadata', () => {
  it('sets title in returned metadata', () => {
    const result = createMetadata({ title: 'Test Title' });
    expect(result.title).toBe('Test Title');
  });

  it('sets description in returned metadata', () => {
    const result = createMetadata({ description: 'Test Description' });
    expect(result.description).toBe('Test Description');
  });

  it('sets openGraph title to match provided title', () => {
    const result = createMetadata({ title: 'Test Title' });
    expect((result.openGraph as any)?.title).toBe('Test Title');
  });

  it('sets openGraph description to match provided description', () => {
    const result = createMetadata({ description: 'Test Description' });
    expect((result.openGraph as any)?.description).toBe('Test Description');
  });

  it('sets twitter title to match provided title', () => {
    const result = createMetadata({ title: 'Test Title' });
    expect((result.twitter as any)?.title).toBe('Test Title');
  });

  it('sets twitter description to match provided description', () => {
    const result = createMetadata({ description: 'Test Description' });
    expect((result.twitter as any)?.description).toBe('Test Description');
  });

  it('sets robots.index to true by default (noIndex=false)', () => {
    const result = createMetadata({});
    expect((result.robots as any)?.index).toBe(true);
  });

  it('sets robots.follow to true by default (noIndex=false)', () => {
    const result = createMetadata({});
    expect((result.robots as any)?.follow).toBe(true);
  });

  it('sets robots.index to false when noIndex=true', () => {
    const result = createMetadata({ noIndex: true });
    expect((result.robots as any)?.index).toBe(false);
  });

  it('sets robots.follow to false when noIndex=true', () => {
    const result = createMetadata({ noIndex: true });
    expect((result.robots as any)?.follow).toBe(false);
  });

  it('includes image in openGraph.images when provided', () => {
    const result = createMetadata({ image: '/test.jpg' });
    expect((result.openGraph as any)?.images).toContain('/test.jpg');
  });

  it('includes image in twitter.images when provided', () => {
    const result = createMetadata({ image: '/test.jpg' });
    expect((result.twitter as any)?.images).toContain('/test.jpg');
  });

  it('sets openGraph.images to undefined when no image provided', () => {
    const result = createMetadata({});
    expect((result.openGraph as any)?.images).toBeUndefined();
  });

  it('sets twitter.images to undefined when no image provided', () => {
    const result = createMetadata({});
    expect((result.twitter as any)?.images).toBeUndefined();
  });

  it('returns object with robots property when called with empty config', () => {
    const result = createMetadata({});
    expect(result.robots).toBeDefined();
  });

  it('handles multiple parameters simultaneously', () => {
    const result = createMetadata({
      title: 'Test Title',
      description: 'Test Description',
      image: '/test.jpg',
      noIndex: true,
    });

    expect(result.title).toBe('Test Title');
    expect(result.description).toBe('Test Description');
    expect((result.openGraph as any)?.images).toContain('/test.jpg');
    expect((result.robots as any)?.index).toBe(false);
  });

  it('creates openGraph object with title and description', () => {
    const result = createMetadata({
      title: 'Test Title',
      description: 'Test Description',
    });

    expect((result.openGraph as any)?.title).toBe('Test Title');
    expect((result.openGraph as any)?.description).toBe('Test Description');
  });

  it('creates twitter object with title and description', () => {
    const result = createMetadata({
      title: 'Test Title',
      description: 'Test Description',
    });

    expect((result.twitter as any)?.title).toBe('Test Title');
    expect((result.twitter as any)?.description).toBe('Test Description');
  });

  it('handles undefined noIndex parameter', () => {
    const result = createMetadata({ title: 'Test' });
    expect((result.robots as any)?.index).toBe(true);
    expect((result.robots as any)?.follow).toBe(true);
  });

  it('handles undefined image parameter', () => {
    const result = createMetadata({ title: 'Test' });
    expect((result.openGraph as any)?.images).toBeUndefined();
  });

  it('handles empty string image parameter', () => {
    const result = createMetadata({ image: '' });
    expect((result.openGraph as any)?.images).toBeUndefined();
  });
});

describe('siteConfig', () => {
  it('has name property set to WorkInKorea', () => {
    expect(siteConfig.name).toBe('WorkInKorea');
  });

  it('has url property with default value', () => {
    const hasUrl = typeof siteConfig.url === 'string' && siteConfig.url.length > 0;
    expect(hasUrl).toBe(true);
  });

  it('url defaults to https://workinkorea.com when NEXT_PUBLIC_SITE_URL not set', () => {
    // When env var is not set, it should use default
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      expect(siteConfig.url).toBe('https://workinkorea.com');
    }
  });

  it('has title property that is non-empty string', () => {
    expect(typeof siteConfig.title).toBe('string');
    expect(siteConfig.title.length).toBeGreaterThan(0);
  });

  it('has description property that is non-empty string', () => {
    expect(typeof siteConfig.description).toBe('string');
    expect(siteConfig.description.length).toBeGreaterThan(0);
  });

  it('has keywords property that is an array', () => {
    expect(Array.isArray(siteConfig.keywords)).toBe(true);
  });

  it('has at least 5 keywords', () => {
    expect(siteConfig.keywords.length).toBeGreaterThanOrEqual(5);
  });

  it('has ogImage property', () => {
    expect(siteConfig.ogImage).toBeDefined();
    expect(typeof siteConfig.ogImage).toBe('string');
  });

  it('ogImage starts with slash', () => {
    expect(siteConfig.ogImage.startsWith('/')).toBe(true);
  });

  it('keywords contains Korean keywords', () => {
    const koreanKeywords = siteConfig.keywords.filter((k) => /[\uAC00-\uD7A3]/.test(k));
    expect(koreanKeywords.length).toBeGreaterThan(0);
  });

  it('keywords contains English keywords', () => {
    const englishKeywords = siteConfig.keywords.filter((k) => /[a-zA-Z]/.test(k));
    expect(englishKeywords.length).toBeGreaterThan(0);
  });

  it('title includes WorkInKorea or related term', () => {
    const titleLower = siteConfig.title.toLowerCase();
    // Title is in Korean and may include 한국 (han-guk) or related terms
    expect(titleLower.includes('korea') || titleLower.includes('한국') || titleLower.includes('매칭')).toBe(true);
  });

  it('url is a valid URL string', () => {
    expect(() => new URL(siteConfig.url)).not.toThrow();
  });

  it('all keywords are non-empty strings', () => {
    const allNonEmpty = siteConfig.keywords.every((k) => typeof k === 'string' && k.length > 0);
    expect(allNonEmpty).toBe(true);
  });
});

describe('defaultMetadata', () => {
  it('has title object with default and template', () => {
    expect(defaultMetadata.title).toBeDefined();
    expect((defaultMetadata.title as any)?.default).toBeDefined();
    expect((defaultMetadata.title as any)?.template).toBeDefined();
  });

  it('title template includes siteConfig.name', () => {
    const template = (defaultMetadata.title as any)?.template;
    expect(template).toContain(siteConfig.name);
  });

  it('title template includes %s placeholder', () => {
    const template = (defaultMetadata.title as any)?.template;
    expect(template).toContain('%s');
  });

  it('has description matching siteConfig', () => {
    expect(defaultMetadata.description).toBe(siteConfig.description);
  });

  it('has keywords array matching siteConfig', () => {
    expect(defaultMetadata.keywords).toEqual(siteConfig.keywords);
  });

  it('has metadataBase property', () => {
    expect(defaultMetadata.metadataBase).toBeDefined();
  });

  it('has openGraph object', () => {
    expect(defaultMetadata.openGraph).toBeDefined();
  });

  it('openGraph.url matches siteConfig.url', () => {
    expect((defaultMetadata.openGraph as any)?.url).toBe(siteConfig.url);
  });

  it('openGraph.type is website', () => {
    expect((defaultMetadata.openGraph as any)?.type).toBe('website');
  });

  it('openGraph.locale is ko_KR', () => {
    expect((defaultMetadata.openGraph as any)?.locale).toBe('ko_KR');
  });

  it('has twitter object', () => {
    expect(defaultMetadata.twitter).toBeDefined();
  });

  it('twitter.card is summary_large_image', () => {
    expect((defaultMetadata.twitter as any)?.card).toBe('summary_large_image');
  });

  it('has robots object with index and follow', () => {
    expect(defaultMetadata.robots).toBeDefined();
    expect((defaultMetadata.robots as any)?.index).toBe(true);
    expect((defaultMetadata.robots as any)?.follow).toBe(true);
  });

  it('robots.googleBot has index and follow', () => {
    const googleBot = (defaultMetadata.robots as any)?.googleBot;
    expect(googleBot?.index).toBe(true);
    expect(googleBot?.follow).toBe(true);
  });

  it('has authors array', () => {
    expect(defaultMetadata.authors).toBeDefined();
    expect(Array.isArray(defaultMetadata.authors)).toBe(true);
  });

  it('has creator property', () => {
    expect(defaultMetadata.creator).toBe('WorkInKorea');
  });

  it('has publisher property', () => {
    expect(defaultMetadata.publisher).toBe('WorkInKorea');
  });

  it('has formatDetection object', () => {
    expect(defaultMetadata.formatDetection).toBeDefined();
    expect((defaultMetadata.formatDetection as any)?.email).toBe(false);
    expect((defaultMetadata.formatDetection as any)?.address).toBe(false);
    expect((defaultMetadata.formatDetection as any)?.telephone).toBe(false);
  });

  it('has verification object', () => {
    expect(defaultMetadata.verification).toBeDefined();
  });
});
