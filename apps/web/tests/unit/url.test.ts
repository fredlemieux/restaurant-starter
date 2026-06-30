import { describe, it, expect } from 'vitest';
import { absoluteUrl } from '../../src/lib/url';

describe('absoluteUrl', () => {
  it('joins a base and a path with one slash', () => {
    expect(absoluteUrl('/about', 'https://example.com')).toBe('https://example.com/about');
  });

  it('strips a trailing slash from the base', () => {
    expect(absoluteUrl('/about', 'https://example.com/')).toBe('https://example.com/about');
  });

  it('prepends a missing leading slash to the path', () => {
    expect(absoluteUrl('about', 'https://example.com')).toBe('https://example.com/about');
  });
});
