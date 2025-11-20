type Locale = 'hr' | 'en';

type TranslationValue = string | Record<string, unknown>;

type Translations = Record<Locale, { translation: Record<string, TranslationValue> }>;

import hr from '@/locales/hr/common.json';
import en from '@/locales/en/common.json';

const DEFAULT_LOCALE: Locale = 'hr';

const translations: Translations = {
  hr: { translation: hr },
  en: { translation: en }
};

function resolvePath(
  obj: Record<string, TranslationValue>,
  path: string[]
): TranslationValue | undefined {
  return path.reduce<TranslationValue | undefined>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, TranslationValue>)[key];
    }
    return undefined;
  }, obj);
}

export function t(
  key: string,
  options?: Record<string, string | number>,
  locale: Locale = DEFAULT_LOCALE
): string {
  const parts = key.split('.');
  const localeTranslations = translations[locale]?.translation;
  const value = resolvePath(localeTranslations, parts);

  if (typeof value !== 'string') {
    return key;
  }

  if (!options) {
    return value;
  }

  return Object.entries(options).reduce((result, [optionKey, optionValue]) => {
    const regex = new RegExp(`{{\\s*${optionKey}\\s*}}`, 'g');
    return result.replace(regex, String(optionValue));
  }, value);
}

export { DEFAULT_LOCALE, type Locale, translations };
