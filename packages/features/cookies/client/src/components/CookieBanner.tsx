'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { Button, Container, Text } from '@piar/ui-components';
import { CookiePreferencesDialog } from './CookiePreferencesDialog';
import { useCookieConsent } from '../hooks/use-cookie-consent';
import type { CookieMessages, CookiePreferences } from '../types';

export interface CookieBannerProps {
  messages: CookieMessages;
  policyLink?: ReactNode;
  storageKey?: string;
  className?: string;
}

export const CookieBanner = ({
  messages,
  policyLink,
  storageKey,
  className,
}: CookieBannerProps) => {
  const { isReady, consent, defaultPreferences, acceptAll, rejectAll, savePreferences } =
    useCookieConsent({ storageKey });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    if (consent?.preferences) {
      setPreferences(consent.preferences);
    }
  }, [consent]);

  if (!isReady || consent) return null;

  return (
    <div className={className}>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <Container width="md" padding="md">
          <div className="rounded-2xl border border-white/40 bg-white/90 p-6 shadow-xl backdrop-blur">
            <div className="space-y-3">
              <Text as="h2" variant="h5" className="text-gray-900">
                {messages.banner.title}
              </Text>
              <Text variant="bodySmall" className="text-gray-600">
                {messages.banner.description}
              </Text>
              {policyLink ? <div className="pt-1">{policyLink}</div> : null}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button variant="ghost" size="sm" onClick={() => setDialogOpen(true)}>
                {messages.banner.manage}
              </Button>
              <Button variant="secondary" size="sm" onClick={rejectAll}>
                {messages.banner.rejectAll}
              </Button>
              <Button variant="primary" size="sm" onClick={acceptAll}>
                {messages.banner.acceptAll}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <CookiePreferencesDialog
        open={dialogOpen}
        messages={messages.dialog}
        preferences={preferences}
        onChange={setPreferences}
        onAcceptAll={() => {
          acceptAll();
          setDialogOpen(false);
        }}
        onRejectAll={() => {
          rejectAll();
          setDialogOpen(false);
        }}
        onSave={() => {
          savePreferences(preferences);
          setDialogOpen(false);
        }}
        onClose={() => setDialogOpen(false)}
        policyLink={policyLink}
      />
    </div>
  );
};
