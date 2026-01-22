import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { AuthCard, AuthPage, Label, Input, Button, Checkbox } from '@piar/ui-components';

/**
 * Login Page
 * Public-facing authentication page with the same layout as the main website
 */
export default function LoginPage() {
  const t = useTranslations('auth.login');

  return (
    <AuthPage>
      <AuthCard
        title={t('title')}
        footer={
          <>
            {t('noAccount')}{' '}
            <Link
              href="/register"
              className="font-medium text-[var(--color-primary)] hover:underline"
            >
              {t('signUp')}
            </Link>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <Label htmlFor="email" required>{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password" required>{t('password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <Checkbox label={t('rememberMe')} />
            <Link
              href="/forgot-password"
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            {t('submit')}
          </Button>
        </form>
      </AuthCard>
    </AuthPage>
  );
}
