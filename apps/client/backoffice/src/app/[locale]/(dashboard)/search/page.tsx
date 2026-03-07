'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { AsyncState, Button, Container, Input, Text } from '@piar/ui-components';
import { Search, User } from 'lucide-react';
import { useBackofficeSearch } from '@/hooks/useBackofficeSearch';
import { useBackofficeTranslations } from '@/lib/backofficeTranslations';

function SearchResults() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { tCommon, tDashboard } = useBackofficeTranslations();

  const queryFromUrl = (searchParams.get('q') ?? '').trim();
  const [queryInput, setQueryInput] = useState(queryFromUrl);

  useEffect(() => {
    setQueryInput(queryFromUrl);
  }, [queryFromUrl]);

  const { data, loading, error } = useBackofficeSearch({
    query: queryFromUrl,
    locale,
    accessToken: session?.accessToken,
    limitPerCollection: 8,
  });

  const accountsResult = useMemo(
    () => data.collections.find((collection) => collection.key === 'accounts'),
    [data.collections],
  );

  const updateQueryInUrl = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    const nextParams = new URLSearchParams(searchParams.toString());

    if (trimmed) {
      nextParams.set('q', trimmed);
    } else {
      nextParams.delete('q');
    }

    const next = nextParams.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQueryInUrl(queryInput);
  };

  const renderErrorMessage = () => {
    if (!error) return null;
    try {
      return tCommon(error.i18nKey ?? 'server_error');
    } catch {
      return error.message;
    }
  };

  const showSessionLoading = status === 'loading';
  const showQueryPrompt = !queryFromUrl;
  const showNoResults = queryFromUrl && !loading && !error && data.total === 0;
  const showResults = queryFromUrl && !loading && !error && data.total > 0 && accountsResult;
  const listHref = `/${locale}/accounts`;

  return (
    <Container className="py-8 px-0" padding="none">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Search className="h-8 w-8 text-[var(--color-secondary)]" />
          <Text as="h1" variant="h2">
            {tCommon('actions.search')}
          </Text>
        </div>
      </div>

      <div>
        <form onSubmit={handleSearch} className="mb-6 flex flex-wrap items-center gap-3">
          <Input
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder={tDashboard('search.prompt')}
            className="min-w-[260px] flex-1"
          />
          <Button type="submit">{tCommon('actions.search')}</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setQueryInput('');
              updateQueryInUrl('');
            }}
            disabled={!queryFromUrl}
          >
            {tCommon('actions.clear')}
          </Button>
        </form>

        {queryFromUrl ? (
          <div className="mb-6">
            <Text variant="body" className="text-gray-600">
              {tDashboard('search.resultsFor')}:{' '}
              <span className="font-semibold text-[var(--color-secondary)]">
                &ldquo;{queryFromUrl}&rdquo;
              </span>
            </Text>
            {showResults ? (
              <Text variant="caption" className="mt-2 text-gray-500">
                {data.total} {tDashboard('search.resultsLabel')}
              </Text>
            ) : null}
          </div>
        ) : null}

        {showSessionLoading || (queryFromUrl && loading) ? (
          <AsyncState variant="loading" title={tDashboard('search.loading')} />
        ) : null}

        {error ? (
          <AsyncState
            variant="error"
            title={tCommon('status.error')}
            description={renderErrorMessage() ?? undefined}
          />
        ) : null}

        {showQueryPrompt ? (
          <AsyncState
            variant="empty"
            title={tDashboard('search.emptyTitle')}
            description={tDashboard('search.emptyDescription')}
          />
        ) : null}

        {showNoResults ? (
          <AsyncState
            variant="empty"
            title={`${tDashboard('search.noResultsFor')} "${queryFromUrl}"`}
            description={tDashboard('search.adjustHint')}
          />
        ) : null}

        {showResults ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-[var(--color-secondary)]" />
                <Text variant="h6">{tDashboard('nav.accounts')}</Text>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                {accountsResult.total}
              </span>
            </div>

            <div className="space-y-2">
              {accountsResult.items.map((item) => (
                <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/${locale}${item.path}`}
                        className="text-sm font-semibold text-[var(--color-secondary)] hover:underline"
                      >
                        {item.title}
                      </Link>
                      {item.subtitle ? (
                        <Text variant="caption" className="mt-1 block text-gray-500">
                          {item.subtitle}
                        </Text>
                      ) : null}
                      {item.description ? (
                        <Text variant="caption" className="mt-2 block text-gray-600">
                          {item.description}
                        </Text>
                      ) : null}
                      {item.updatedAt ? (
                        <Text variant="caption" className="mt-1 block text-gray-400">
                          {new Date(item.updatedAt).toLocaleString(locale)}
                        </Text>
                      ) : null}
                    </div>

                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/${locale}${item.path}`}>{tCommon('actions.view')}</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Button asChild variant="outline" size="sm">
                <Link href={listHref}>{tDashboard('nav.accounts')}</Link>
              </Button>

              {accountsResult.total > accountsResult.items.length ? (
                <Text variant="caption" className="text-gray-500">
                  +{accountsResult.total - accountsResult.items.length}
                </Text>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-8 px-0" padding="none">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Search className="h-8 w-8 text-[var(--color-secondary)]" />
              <Text as="h1" variant="h2">
                Search
              </Text>
            </div>
          </div>
        </Container>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
