import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { AuthCard, AuthPage, Label, Input, Button } from '@piar/ui-components';

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
          <p>
            {t('rememberPassword')}{' '}
            <Link
              href="/login"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              {t('backToLogin')}
            </Link>
          </p>
          <p>
            {t('noAccount')}{' '}
            <Link
              href="/register"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              {t('signUp')}
            </Link>
          </p>
        </div>
      }
    >
      <form className="space-y-4">
        <div>
          <Label htmlFor="email">{t('email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <Button type="submit" variant="primary" className="w-full">
          {t('submit')}
        </Button>
      </form>
    </AuthCard>
    </AuthPage>
  );
}
