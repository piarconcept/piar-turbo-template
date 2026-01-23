import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ShieldAlert, Clock } from 'lucide-react';
import { AuthCard, AuthPage, Text } from '@piar/ui-components';
import { LogoutButton } from '@/components/auth/logout-button';

/**
 * Unauthorized Page
 * Shown when a user has registered but doesn't have access permissions yet
 * Their account is pending approval from an administrator
 */
export default function UnauthorizedPage() {
  const t = useTranslations('auth.unauthorized');

  return (
    <AuthPage>
      <AuthCard
        title={t('title')}
        description={t('message')}
        icon={
          <div className="relative">
            <ShieldAlert className="h-16 w-16 text-[var(--color-primary)]" />
            <Clock className="absolute -bottom-2 -right-2 h-8 w-8 text-[var(--color-secondary)]" />
          </div>
        }
        className="border-orange-200 bg-orange-50"
        footer={
          <p className="text-sm text-gray-500">
            {t('needHelp')}{' '}
            <Link
              href="/contact"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              {t('contactSupport')}
            </Link>
          </p>
        }
      >
        <div className="rounded-lg bg-white p-6 text-left">
          <Text variant="h3" className="mb-3 font-semibold text-[var(--color-secondary)]">
            {t('whatHappensNext')}
          </Text>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-[var(--color-primary)]">•</span>
              <Text variant="body">{t('step1')}</Text>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-[var(--color-primary)]">•</span>
              <Text variant="body">{t('step2')}</Text>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-[var(--color-primary)]">•</span>
              <Text variant="body">{t('step3')}</Text>
            </li>
          </ul>
          <div className="mt-6 flex justify-end">
            <LogoutButton />
          </div>
        </div>
      </AuthCard>
    </AuthPage>
  );
}
