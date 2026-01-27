'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AuthCard, AuthPage, Label, Input, Button, Checkbox, Text } from '@piar/ui-components';

/**
 * Login Page
 * Public-facing authentication page with NextAuth integration
 */
export default function LoginPage() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Pass all credentials and options in a single object
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError(t('error'));
        setIsLoading(false);
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch {
      setError(t('error'));
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
              {t('noAccount')}{' '}
            </Text>
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

          <div className="flex items-center justify-between">
            <Checkbox
              label={t('rememberMe')}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Button
              asChild
              variant="ghost"
              size="inline"
              className="px-0 text-[var(--color-primary)] hover:bg-transparent hover:underline"
            >
              <Link href="/forgot-password">
                <Text as="span" variant="bodySmall" className="text-[var(--color-primary)]">
                  {t('forgotPassword')}
                </Text>
              </Link>
            </Button>
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? t('loading') : t('submit')}
          </Button>
        </form>
      </AuthCard>
    </AuthPage>
  );
}
