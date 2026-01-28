'use client';

import { type ReactNode, useEffect } from 'react';
import { Button, Checkbox, Container, Text } from '@piar/ui-components';
import type { CookieDialogMessages, CookiePreferences } from '../types';

export interface CookiePreferencesDialogProps {
  open: boolean;
  messages: CookieDialogMessages;
  preferences: CookiePreferences;
  onChange: (next: CookiePreferences) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSave: () => void;
  onClose: () => void;
  policyLink?: ReactNode;
}

export const CookiePreferencesDialog = ({
  open,
  messages,
  preferences,
  onChange,
  onAcceptAll,
  onRejectAll,
  onSave,
  onClose,
  policyLink,
}: CookiePreferencesDialogProps) => {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Container width="md" padding="md">
        <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />
        <div className="relative w-full max-w-2xl rounded-2xl border border-white/40 bg-white/90 p-6 shadow-xl backdrop-blur">
          <div className="space-y-2">
            <Text as="h2" variant="h4" className="text-gray-900">
              {messages.title}
            </Text>
            <Text variant="bodySmall" className="text-gray-600">
              {messages.description}
            </Text>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text as="h3" variant="h6" className="text-gray-900">
                    {messages.categories.necessary.title}
                  </Text>
                  <Text variant="bodySmall" className="mt-1 text-gray-600">
                    {messages.categories.necessary.description}
                  </Text>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Checkbox checked disabled />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text as="h3" variant="h6" className="text-gray-900">
                    {messages.categories.analytics.title}
                  </Text>
                  <Text variant="bodySmall" className="mt-1 text-gray-600">
                    {messages.categories.analytics.description}
                  </Text>
                </div>
                <Checkbox
                  checked={preferences.analytics}
                  onChange={(event) =>
                    onChange({
                      ...preferences,
                      analytics: event.target.checked,
                    })
                  }
                  aria-label={messages.categories.analytics.title}
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Text as="h3" variant="h6" className="text-gray-900">
                    {messages.categories.marketing.title}
                  </Text>
                  <Text variant="bodySmall" className="mt-1 text-gray-600">
                    {messages.categories.marketing.description}
                  </Text>
                </div>
                <Checkbox
                  checked={preferences.marketing}
                  onChange={(event) =>
                    onChange({
                      ...preferences,
                      marketing: event.target.checked,
                    })
                  }
                  aria-label={messages.categories.marketing.title}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-4 border-t border-white/50 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-wrap gap-3 sm:justify-end">
              <Button variant="secondary" size="sm" onClick={onRejectAll}>
                {messages.rejectAll}
              </Button>
              <Button variant="primary" size="sm" onClick={onAcceptAll}>
                {messages.acceptAll}
              </Button>
            </div>
          </div>
          <div className="mt-0 flex flex-col gap-4 border-t border-white/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">{policyLink}</div>
            <div className="flex flex-wrap gap-3 sm:justify-end">
              <Button variant="ghost" size="sm" onClick={onSave}>
                {messages.savePreferences}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
