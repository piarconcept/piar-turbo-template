'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HttpAuthRepository } from '@piar/auth-infra-client';
import { AuthCard, AuthPage, Label, Input, Button, Checkbox, Text } from '@piar/ui-components';

interface HttpErrorPayload {
  message?: string;
  i18nKey?: string;
}

function extractErrorMessage(error: unknown): string | undefined {
  if (!(error instanceof Error)) return undefined;

  try {
    const parsed = JSON.parse(error.message) as HttpErrorPayload;
    if (parsed?.message && typeof parsed.message === 'string') {
      return parsed.message;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

/**
 * Register Page
 * User registration page with the same layout as the main website
 */
export default function RegisterPage() {
  const t = useTranslations('auth.register');
  const router = useRouter();
  const authRepository = new HttpAuthRepository(
    process.env.NEXT_PUBLIC_BACKOFFICE_BFF_URL || 'http://localhost:5050',
  );

  const [accountCode, setAccountCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    if (!acceptTerms) {
      setError(t('termsRequired'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await authRepository.register({
        accountCode,
        email,
        password,
      });
      if (response.account) {
        router.push('/login');
      } else {
        setError(t('error'));
      }
    } catch (error) {
      const backendMessage = extractErrorMessage(error);
      setError(backendMessage ?? t('error'));
    } finally {
      setIsLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <Text as="p" variant="bodySmall" className="text-red-600">
                {error}
              </Text>
            </div>
          )}

          <div>
            <Label htmlFor="accountCode" required>
              {t('accountCode')}
            </Label>
            <Input
              id="accountCode"
              type="text"
              placeholder="ACC-001"
              value={accountCode}
              onChange={(e) => setAccountCode(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="email" required>
              {t('email')}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" required>
              {t('password')}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" required>
              {t('confirmPassword')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex items-start">
            <Checkbox
              id="terms"
              required
              wrapperClassName="items-start"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              disabled={isLoading}
            />
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

          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? t('loading') : t('submit')}
          </Button>
        </form>
      </AuthCard>
    </AuthPage>
  );
}
