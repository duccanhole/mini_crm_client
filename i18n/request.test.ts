import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/server', () => ({
  getRequestConfig: (factory: unknown) => factory,
}));

vi.mock('./routing', () => ({
  routing: {
    locales: ['en', 'vi'],
    defaultLocale: 'vi',
  },
}));

import requestConfigFactory from '@/i18n/request';

describe('i18n request config', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('uses requested locale when locale is supported', async () => {
    const config = await requestConfigFactory({
      requestLocale: Promise.resolve('en'),
    } as never);

    expect(config.locale).toBe('en');
    expect(config.messages).toHaveProperty('LoginPage.title');
  });

  it('falls back to default locale when request locale is invalid', async () => {
    const config = await requestConfigFactory({
      requestLocale: Promise.resolve('jp'),
    } as never);

    expect(config.locale).toBe('vi');
    expect(config.messages).toHaveProperty('LoginPage.title');
  });

  it('returns namespaced key in getMessageFallback', async () => {
    const config = await requestConfigFactory({
      requestLocale: Promise.resolve('en'),
    } as never);

    expect(config.getMessageFallback({ namespace: 'common', key: 'save' })).toBe('common.save');
    expect(config.getMessageFallback({ namespace: undefined, key: 'save' })).toBe('save');
  });

  it('logs unexpected i18n errors and ignores missing-message errors', async () => {
    const config = await requestConfigFactory({
      requestLocale: Promise.resolve('en'),
    } as never);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    config.onError({ code: 'MISSING_MESSAGE' } as never);
    expect(errorSpy).not.toHaveBeenCalled();

    const unknownError = { code: 'UNKNOWN_ERROR', detail: 'boom' };
    config.onError(unknownError as never);
    expect(errorSpy).toHaveBeenCalledOnce();
    expect(errorSpy).toHaveBeenCalledWith(unknownError);
  });
});
