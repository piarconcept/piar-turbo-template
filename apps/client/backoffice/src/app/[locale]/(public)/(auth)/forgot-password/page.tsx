import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { AuthCard, AuthPage, Label, Input, Button, Text } from '@piar/ui-components';

/**
 * Forgot Password Page
 * Allows users to request a password reset link
 */
export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword');

  return (
    <AuthPage>
      <AuthCard
        title={t('title')}
        description={t('description')}
        icon={<KeyRound className="h-12 w-12 text-[var(--color-primary)]" />}
        footer={
          <div className="space-y-3">
            <Text as="p" variant="bodySmall">
              {t('rememberPassword')}{' '}
              <Button
                asChild
                variant="ghost"
                size="inline"
                className="px-0 text-[var(--color-primary)] hover:bg-transparent hover:underline"
              >
                <Link href="/login">
                  <Text as="span" variant="bodySmall" className="text-[var(--color-primary)]">
                    {t('backToLogin')}
                  </Text>
                </Link>
              </Button>
            </Text>
            <Text as="p" variant="bodySmall">
              {t('noAccount')}{' '}
              <Button
                asChild
                variant="ghost"
                size="inline"
                className="px-0 text-[var(--color-primary)] hover:bg-transparent hover:underline"
              >
                <Link href="/register">
                  <Text as="span" variant="bodySmall" className="text-[var(--color-primary)]">
                    {t('signUp')}
                  </Text>
                </Link>
              </Button>
            </Text>
          </div>
        }
      >
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            {t('submit')}
          </Button>
        </form>
      </AuthCard>
    </AuthPage>
  );
}
