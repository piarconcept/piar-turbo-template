'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CookieConsentState, CookiePreferences, CookieConsentStatus } from '../types';

const DEFAULT_STORAGE_KEY = 'piar-cookie-consent';

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const safeParse = (raw: string | null): CookieConsentState | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CookieConsentState;
    if (!parsed || !parsed.preferences || !parsed.updatedAt) return null;
    return {
      status: parsed.status,
      preferences: {
        necessary: true,
        analytics: Boolean(parsed.preferences.analytics),
        marketing: Boolean(parsed.preferences.marketing),
      },
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
};

const deriveStatus = (preferences: CookiePreferences): CookieConsentStatus => {
  if (preferences.analytics && preferences.marketing) return 'accepted';
  if (!preferences.analytics && !preferences.marketing) return 'rejected';
  return 'custom';
};

const normalizePreferences = (preferences: Partial<CookiePreferences>): CookiePreferences => ({
  necessary: true,
  analytics: Boolean(preferences.analytics),
  marketing: Boolean(preferences.marketing),
});

export interface UseCookieConsentOptions {
  storageKey?: string;
}

export const useCookieConsent = (options: UseCookieConsentOptions = {}) => {
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const [consent, setConsent] = useState<CookieConsentState | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = safeParse(globalThis?.localStorage?.getItem(storageKey) ?? null);
    setConsent(stored);
    setIsReady(true);
  }, [storageKey]);

  const updateConsent = useCallback(
    (preferences: CookiePreferences) => {
      const next: CookieConsentState = {
        status: deriveStatus(preferences),
        preferences,
        updatedAt: new Date().toISOString(),
      };
      setConsent(next);
      globalThis?.localStorage?.setItem(storageKey, JSON.stringify(next));
    },
    [storageKey],
  );

  const acceptAll = useCallback(() => {
    updateConsent({ necessary: true, analytics: true, marketing: true });
  }, [updateConsent]);

  const rejectAll = useCallback(() => {
    updateConsent({ necessary: true, analytics: false, marketing: false });
  }, [updateConsent]);

  const savePreferences = useCallback(
    (preferences: Partial<CookiePreferences>) => {
      updateConsent(normalizePreferences(preferences));
    },
    [updateConsent],
  );

  const value = useMemo(
    () => ({
      isReady,
      consent,
      defaultPreferences,
      acceptAll,
      rejectAll,
      savePreferences,
    }),
    [isReady, consent, acceptAll, rejectAll, savePreferences],
  );

  return value;
};
