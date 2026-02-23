'use client';

import { useParams, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, Mail, Shield, User } from 'lucide-react';
import { Button, Container, Text } from '@piar/ui-components';
import { useBackofficeTranslations } from '@/lib/backofficeTranslations';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const { tCommon, tDashboard } = useBackofficeTranslations();

  const localeParam = params.locale;
  const locale = Array.isArray(localeParam) ? localeParam[0] : (localeParam ?? 'en');

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push(`/${locale}/login`);
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Text variant="body">{tCommon('status.loading')}</Text>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Text variant="body">{tCommon('status.error')}</Text>
      </div>
    );
  }

  return (
    <Container className="px-0 py-8" padding="none">
      <div className="mb-6">
        <Text as="h1" variant="h2">
          {tDashboard('profile.title')}
        </Text>
        <Text variant="body" className="mt-2 text-gray-600">
          {tDashboard('profile.viewProfile')}
        </Text>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
            <User className="h-8 w-8" />
          </div>
          <div>
            <Text as="h2" variant="h4">
              {session.user.name || session.user.email || 'User'}
            </Text>
            <Text variant="bodySmall" className="text-gray-600">
              {session.user.email || '-'}
            </Text>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <Text variant="caption" className="text-gray-500">
                {tDashboard('profile.email')}
              </Text>
              <Text variant="body">{session.user.email || '-'}</Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <Text variant="caption" className="text-gray-500">
                {tDashboard('profile.userId')}
              </Text>
              <Text variant="body" className="break-all">
                {session.user.id || '-'}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-500" />
            <div>
              <Text variant="caption" className="text-gray-500">
                {tDashboard('profile.role')}
              </Text>
              <div className="mt-1 inline-flex items-center rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-sm font-medium text-[var(--color-primary)]">
                {session.user.role || 'user'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-200 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${locale}/dashboard`)}
          >
            {tCommon('actions.back')}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleLogout}
            className="inline-flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {tDashboard('profile.logout')}
          </Button>
        </div>
      </div>
    </Container>
  );
}
