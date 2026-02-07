'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname, routing } from '@/i18n/routing';

export const useLanguage = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  const toggleLanguage = () => {
    const nextLocale = locale === 'vi' ? 'en' : 'vi';
    changeLanguage(nextLocale);
  };

  return {
    currentLocale: locale,
    allLocales: routing.locales,
    changeLanguage,
    toggleLanguage,
    isVietnamese: locale === 'vi',
    isEnglish: locale === 'en',
  };
};
