import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { AuthCard, AuthPage, Label, Input, Button, Checkbox } from '@piar/ui-components';

/**
 * Register Page
 * User registration page with the same layout as the main website
 */
export default function RegisterPage() {
  const t = useTranslations('auth.register');

  return (
    <AuthPage>
      <AuthCard
        title={t('title')}
        footer={
          <>
            {t('haveAccount')}{' '}
            <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
              {t('signIn')}
            </Link>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <Label htmlFor="email" required>
              {t('email')}
            </Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>

          <div>
            <Label htmlFor="password" required>
              {t('password')}
            </Label>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>

          <div>
            <Label htmlFor="confirmPassword" required>
              {t('confirmPassword')}
            </Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" required />
          </div>

          <div className="flex items-start">
            <Checkbox id="terms" required wrapperClassName="items-start" />
            <Label htmlFor="terms" className="text-sm text-gray-600 font-normal ml-2">
              {t('acceptTerms')}{' '}
              <Link href="/terms" className="text-[var(--color-primary)] hover:underline">
                {t('termsAndConditions')}
              </Link>
            </Label>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            {t('submit')}
          </Button>
        </form>
      </AuthCard>
    </AuthPage>
  );
}
