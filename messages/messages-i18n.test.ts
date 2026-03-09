import { describe, expect, it } from 'vitest';

import enMessages from '@/messages/en.json';
import viMessages from '@/messages/vi.json';

const collectKeys = (value: unknown, prefix = ''): string[] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return collectKeys(nested, path);
    }
    return [path];
  });
};

describe('i18n messages consistency', () => {
  it('keeps EN and VI message key trees aligned', () => {
    const enKeys = collectKeys(enMessages).sort();
    const viKeys = collectKeys(viMessages).sort();

    expect(viKeys).toEqual(enKeys);
  });
});
