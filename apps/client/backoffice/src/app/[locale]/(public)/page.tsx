import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Shield, Users, BarChart, Settings, ArrowRight } from 'lucide-react';
import { Button, Text } from '@piar/ui-components';

/**
 * Backoffice Home Page
 * Landing page for the backoffice application
 */
export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="mb-16 text-center flex flex-col items-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-[var(--color-secondary)]/10 p-8">
            <Shield className="h-20 w-20 text-[var(--color-secondary)]" />
          </div>
        </div>
        <Text
          variant="h1"
          className="mb-4 text-5xl text-[var(--color-secondary)] justify-center"
        >
          {t('title')}
        </Text>
        <Text
          variant="body"
          className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 justify-center"
        >
          {t('subtitle')}
        </Text>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="primary" size="lg" asChild>
            <Link href="/login" className="flex items-center gap-2">
              {t('signIn')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/register">
              {t('requestAccess')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <Text
          variant="h2"
          className="mb-8 text-center text-[var(--color-secondary)]"
        >
          {t('features.title')}
        </Text>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title={t('features.users.title')}
            description={t('features.users.description')}
          />
          <FeatureCard
            icon={<BarChart className="h-8 w-8" />}
            title={t('features.analytics.title')}
            description={t('features.analytics.description')}
          />
          <FeatureCard
            icon={<Settings className="h-8 w-8" />}
            title={t('features.settings.title')}
            description={t('features.settings.description')}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-lg bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] p-12 text-center text-white">
        <Text variant="h2" className="mb-4 text-white">
          {t('cta.title')}
        </Text>
        <Text variant="body" className="mb-8 text-lg text-white opacity-90">
          {t('cta.description')}
        </Text>
        <Button variant="secondary" size="lg" asChild>
          <Link href="/register" className="text-[var(--color-secondary)] hover:scale-105 text-white">
            {t('cta.button')}
          </Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * FeatureCard Component
 * Displays a feature with icon, title, and description
 * Note: Kept as internal component since only used once.
 * If used 3+ times across pages, extract to @piar/ui-components as molecule.
 */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
        {icon}
      </div>
      <Text variant="h3" className="mb-2 text-[var(--color-secondary)]">
        {title}
      </Text>
      <Text variant="body" className="text-gray-600">
        {description}
      </Text>
    </div>
  );
}
