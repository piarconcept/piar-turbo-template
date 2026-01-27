import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { AuthCard, AuthPage, Label, Input, Button, Checkbox, Text } from '@piar/ui-components';

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
            <Text as="span" variant="bodySmall">
              {t('haveAccount')}{' '}
            </Text>
            <Button
              asChild
              variant="ghost"
              size="inline"
              className="px-0 text-[var(--color-primary)] hover:bg-transparent hover:underline"
            >
              <Link href="/login">
                <Text as="span" variant="bodySmall" className="text-[var(--color-primary)]">
                  {t('signIn')}
                </Text>
              </Link>
            </Button>
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
            <Label htmlFor="terms" className="ml-2 text-sm font-normal text-gray-600">
              <Text as="span" variant="bodySmall" className="text-gray-600">
                {t('acceptTerms')}{' '}
              </Text>
              <Button
                asChild
                variant="ghost"
                size="inline"
                className="px-0 text-[var(--color-primary)] hover:bg-transparent hover:underline"
              >
                <Link href="/terms">
                  <Text as="span" variant="bodySmall" className="text-[var(--color-primary)]">
                    {t('termsAndConditions')}
                  </Text>
                </Link>
              </Button>
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
