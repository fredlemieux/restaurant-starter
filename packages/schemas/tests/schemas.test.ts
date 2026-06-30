import { describe, it, expect } from 'vitest';
import { schemaTypes } from '../src';

describe('schemas package', () => {
  it('exports all document and object types', () => {
    const names = schemaTypes.map((s) => s.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'restaurant',
        'menu',
        'page',
        'event',
        'press',
        'openingHours',
        'allergen',
        'seo',
        'address',
        'socialLinks',
      ]),
    );
  });

  it('each schema has a unique name', () => {
    const names = schemaTypes.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('every document type has a name field or equivalent', () => {
    const documents = schemaTypes.filter((s) => s.type === 'document');
    for (const doc of documents) {
      expect(doc.fields).toBeDefined();
      expect(Array.isArray(doc.fields)).toBe(true);
      expect((doc.fields as { name: string }[]).length).toBeGreaterThan(0);
    }
  });
});
