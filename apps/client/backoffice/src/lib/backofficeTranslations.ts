import { useTranslations } from 'next-intl';

export type BackofficeTranslator = (key: string) => string;

export function useBackofficeTranslations() {
  const tCommon = useTranslations('common');
  const tFields = useTranslations('fields');
  const tDashboard = useTranslations('dashboard');

  const tryTranslate = (translator: (key: string) => string, key: string) => {
    try {
      return translator(key);
    } catch {
      return key;
    }
  };

  const isMissingTranslation = (value: string, key: string, namespace: string) => {
    return value === key || value === `${namespace}.${key}` || value.startsWith(`${namespace}.`);
  };

  const resolveFrom = (
    translator: (key: string) => string,
    namespace: string,
    candidates: string[],
  ): string | undefined => {
    for (const candidate of candidates) {
      const value = tryTranslate(translator, candidate);
      if (!isMissingTranslation(value, candidate, namespace)) {
        return value;
      }
    }
    return undefined;
  };

  const t: BackofficeTranslator = (key) => {
    // Literal labels from field config should be displayed as-is.
    if (!key.includes('.')) {
      return key;
    }

    if (key.startsWith('common.')) {
      const stripped = key.replace('common.', '');
      return resolveFrom(tCommon, 'common', [stripped, key]) ?? key;
    }

    if (key.startsWith('fields.')) {
      const stripped = key.replace('fields.', '');
      return resolveFrom(tFields, 'fields', [key, stripped]) ?? key;
    }

    if (key.startsWith('dashboard.')) {
      const stripped = key.replace('dashboard.', '');
      return resolveFrom(tDashboard, 'dashboard', [stripped, key]) ?? key;
    }

    // Unprefixed domain keys like `options.account.role.admin.label`.
    return resolveFrom(tFields, 'fields', [key]) ?? key;
  };

  return { t, tCommon, tFields, tDashboard };
}
