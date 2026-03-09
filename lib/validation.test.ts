import { describe, expect, it } from 'vitest';

import { validatePhoneNumber, VN_PHONE_REGEX } from '@/lib/validation';

describe('validatePhoneNumber', () => {
  it('returns true for a valid 10-digit phone number starting with 0', () => {
    expect(validatePhoneNumber('0912345678')).toBe(true);
  });

  it('returns false when phone number has fewer than 10 digits', () => {
    expect(validatePhoneNumber('091234567')).toBe(false);
  });

  it('returns false when phone number does not start with 0', () => {
    expect(validatePhoneNumber('1912345678')).toBe(false);
  });

  it('returns false when phone number contains non-numeric characters', () => {
    expect(validatePhoneNumber('09a2345678')).toBe(false);
  });
});

describe('VN_PHONE_REGEX', () => {
  it('matches valid number and rejects number with surrounding whitespace', () => {
    expect(VN_PHONE_REGEX.test('0987654321')).toBe(true);
    expect(VN_PHONE_REGEX.test(' 0987654321 ')).toBe(false);
  });
});
