'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { LogoutButton } from '@/components/auth/logout-button';

/**
 * Dashboard Home Page
 * Main overview page for the backoffice with user session info
 */
export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Logout Button */}
      <div className="border-b border-gray-200 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-secondary)]">{t('title')}</h1>
          <p className="mt-2 text-gray-600">{t('subtitle')}</p>
        </div>
        <LogoutButton />
      </div>

      {/* User Session Info Card */}
      {session && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-secondary)]">
            Session Information
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-600">{session.user?.email}</span>
            </div>
            {session.user?.name && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-600">{session.user.name}</span>
              </div>
            )}
            {session.user?.role && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Role:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)] text-white">
                  {session.user.role}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">User ID:</span>
              <span className="text-gray-600 font-mono text-sm">{session.user?.id}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title={t('stats.users')} value="1,234" change="+12%" changeType="positive" />
        <StatsCard title={t('stats.content')} value="567" change="+8%" changeType="positive" />
        <StatsCard title={t('stats.views')} value="45.2K" change="+23%" changeType="positive" />
        <StatsCard title={t('stats.conversion')} value="3.24%" change="-2%" changeType="negative" />
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-[var(--color-secondary)]">
          {t('recentActivity')}
        </h2>
        <div className="space-y-4">
          <ActivityItem title="New user registered" time="2 minutes ago" type="user" />
          <ActivityItem title="Content published" time="15 minutes ago" type="content" />
          <ActivityItem title="Settings updated" time="1 hour ago" type="settings" />
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  change,
  changeType,
}: {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="mt-2 text-3xl font-bold text-[var(--color-secondary)]">{value}</p>
      <p
        className={`mt-2 text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}
      >
        {change} from last month
      </p>
    </div>
  );
}

function ActivityItem({ title, time, type }: { title: string; time: string; type: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center">
          <span className="text-sm font-semibold text-[var(--color-secondary)]">
            {type[0].toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
    </div>
  );
}
