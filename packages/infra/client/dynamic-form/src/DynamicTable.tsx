'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@piar/messages';
import type { DynamicQuery } from '@piar/domain-dynamic-form';
import type { EntityFieldsConfig, FieldConfig } from '@piar/domain-fields';
import {
  AsyncState,
  Button,
  Pagination,
  SearchInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@piar/ui-components';
import { clsx } from 'clsx';
import { translateWithFallback } from './fields/utils';

// (types imported from @piar/domain-dynamic-form)

export type FilterOperator = 'equals' | 'contains' | 'in';

export interface FilterDefinition {
  key: string;
  label: string; // i18n key
  type: 'text' | 'select' | 'boolean';
  operator?: FilterOperator;
  options?: Array<{ value: string; label: string }>;
}

export type QueryState = DynamicQuery;
export interface DynamicRowAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface DynamicTableColumn {
  key: string;
  /** Optional i18n label key override. Defaults to FieldConfig.label */
  label?: string;
  /**
   * How to render values.
   * - auto: tries to detect i18n
   * - i18n: treat value as I18nText
   */
  valueType?: 'auto' | 'i18n' | 'boolean' | 'date' | 'text';
  className?: string;
}

export interface DynamicTableProps<TEntity = unknown> {
  config: EntityFieldsConfig<TEntity>;
  locale: SupportedLanguage;

  columns: DynamicTableColumn[];
  rows: Array<Record<string, unknown>>;

  total: number;
  query: QueryState;
  /** Loading state to show an inline indicator without unmounting the page */
  loading?: boolean;
  /** Error message for table state */
  error?: string | null;

  /** If missing or empty, search input is hidden */
  searchKeys?: string[];
  searchPlaceholder?: string;

  /** Filters are defined by the page using the component */
  filters?: FilterDefinition[];

  /** Translate function for domain i18n keys */
  t?: (key: string) => string;

  /** Called whenever user changes query (search/sort/filters/page/limit). Should refetch server-side. */
  onQueryChange: (next: QueryState) => void | Promise<void>;

  newButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };

  rowActions?: (row: Record<string, unknown>) => DynamicRowAction[];
  rowClickable?: boolean;
  showActionsColumn?: boolean;
  tableClassName?: string;
  tableContainerClassName?: string;
  stickyHeader?: boolean;
  emptyDescription?: string;
  errorDescription?: string;
  onRetry?: () => void;

  getRowId?: (row: Record<string, unknown>, index: number) => string;
  className?: string;
}

function translate(t: DynamicTableProps['t'], key?: string) {
  if (!key) return '';
  try {
    return t ? t(key) : key;
  } catch {
    return key;
  }
}

function DebouncedSearchInput({
  value,
  onDebouncedChange,
  placeholder,
  containerClassName,
  debounceMs = 400,
}: {
  value: string;
  onDebouncedChange: (next: string) => void;
  placeholder?: string;
  containerClassName?: string;
  debounceMs?: number;
}) {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  React.useEffect(() => {
    if (localValue === value) return;
    const t = setTimeout(() => onDebouncedChange(localValue), debounceMs);
    return () => clearTimeout(t);
  }, [debounceMs, localValue, value, onDebouncedChange]);

  return (
    <SearchInput
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      containerClassName={containerClassName}
    />
  );
}

function isI18nObject(value: unknown): value is Partial<Record<SupportedLanguage, unknown>> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return SUPPORTED_LANGUAGES.some((lang) => lang in (value as Record<string, unknown>));
}

function isI18nText(
  value: unknown,
): value is Array<{ language: string; value: string }> | Record<string, unknown> {
  if (Array.isArray(value)) {
    return value.every((v) => v && typeof v === 'object' && 'language' in v && 'value' in v);
  }
  return isI18nObject(value);
}

function resolveI18nValue(value: unknown, locale: SupportedLanguage) {
  if (!isI18nText(value)) return value;
  if (Array.isArray(value)) {
    return value.find((v) => v.language === locale)?.value ?? value[0]?.value ?? '';
  }
  const record = value as Record<string, unknown>;
  if (record[locale] != null) return String(record[locale]);
  for (const lang of SUPPORTED_LANGUAGES) {
    const candidate = record[lang];
    if (candidate) return String(candidate);
  }
  return '';
}

function findField<TEntity>(config: EntityFieldsConfig<TEntity>, key: string) {
  return (config.fields as Array<FieldConfig<TEntity, unknown>>).find((f) => String(f.key) === key);
}

function areFiltersEqual(a?: DynamicQuery['filters'], b?: DynamicQuery['filters']) {
  if (a === b) return true;
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (!(key in b)) return false;
    const av = a[key];
    const bv = b[key];
    if (Array.isArray(av) || Array.isArray(bv)) {
      if (!Array.isArray(av) || !Array.isArray(bv)) return false;
      if (av.length !== bv.length) return false;
      for (let i = 0; i < av.length; i += 1) {
        if (av[i] !== bv[i]) return false;
      }
    } else if (av !== bv) {
      return false;
    }
  }
  return true;
}

function isSameQuery(a: QueryState, b: QueryState) {
  if (a.page !== b.page) return false;
  if (a.limit !== b.limit) return false;
  if (a.searchQuery !== b.searchQuery) return false;
  if (a.sort?.key !== b.sort?.key) return false;
  if (a.sort?.direction !== b.sort?.direction) return false;
  if (!areFiltersEqual(a.filters, b.filters)) return false;
  return true;
}

function isInteractiveElement(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'a,button,input,select,textarea,label,[role="button"],[data-row-click-ignore="true"]',
    ),
  );
}

function isValidRowAction(action: DynamicRowAction) {
  return Boolean(action.href || action.onClick);
}

export function DynamicTable<TEntity>({
  config,
  locale,
  columns,
  rows,
  total,
  query,
  loading,
  error,
  searchKeys,
  searchPlaceholder,
  filters,
  t,
  onQueryChange,
  newButton,
  rowActions,
  rowClickable = true,
  showActionsColumn,
  tableClassName,
  tableContainerClassName,
  stickyHeader = true,
  emptyDescription,
  errorDescription,
  onRetry,
  getRowId,
  className,
}: DynamicTableProps<TEntity>) {
  const router = useRouter();
  const hasSearch = Array.isArray(searchKeys) && searchKeys.length > 0;

  const setQuery = (patch: Partial<QueryState>) => {
    const next: QueryState = {
      ...query,
      ...patch,
    };

    // Reset page when changing filters/search/sort/limit
    const shouldResetPage =
      (patch.searchQuery !== undefined && patch.searchQuery !== query.searchQuery) ||
      (patch.sort !== undefined &&
        (patch.sort?.key !== query.sort?.key || patch.sort?.direction !== query.sort?.direction)) ||
      (patch.filters !== undefined && !areFiltersEqual(patch.filters, query.filters)) ||
      (patch.limit !== undefined && patch.limit !== query.limit);

    if (shouldResetPage) {
      next.page = 1;
    }

    if (isSameQuery(query, next)) return;
    void onQueryChange(next);
  };

  const toggleSort = (key: string) => {
    const current = query.sort;
    if (!current || current.key !== key) return setQuery({ sort: { key, direction: 'asc' } });
    if (current.direction === 'asc') return setQuery({ sort: { key, direction: 'desc' } });
    return setQuery({ sort: undefined });
  };

  const yesLabel = translateWithFallback(t, 'common.general.yes', 'Yes');
  const noLabel = translateWithFallback(t, 'common.general.no', 'No');
  const allLabel = translateWithFallback(t, 'common.general.all', 'All');
  const actionsLabel = translateWithFallback(t, 'common.table.actions', 'Actions');
  const retryLabel = translateWithFallback(t, 'common.actions.retry', 'Retry');
  const noResultsLabel = translateWithFallback(t, 'common.general.noResults', 'No results.');
  const loadingLabel = translateWithFallback(t, 'common.status.loading', 'Loading...');
  const errorLabel = translateWithFallback(t, 'common.status.error', 'Error');
  const searchLabel = translateWithFallback(t, 'common.actions.search', 'Search');
  const resolvedSearchPlaceholder =
    searchPlaceholder ??
    (searchKeys && searchKeys.length > 0
      ? `${searchLabel}: ${searchKeys.join(', ')}`
      : searchLabel);
  const actionsByRow = React.useMemo(
    () => rows.map((row) => (rowActions?.(row) ?? []).filter(isValidRowAction)),
    [rows, rowActions],
  );
  const shouldShowActionsColumn = rowActions
    ? (showActionsColumn ?? (!rowClickable || actionsByRow.some((actions) => actions.length > 1)))
    : false;

  const runAction = React.useCallback(
    (action?: DynamicRowAction) => {
      if (!action) return;
      if (action.href) {
        router.push(action.href);
        return;
      }
      action.onClick?.();
    },
    [router],
  );

  const renderCellValue = (col: DynamicTableColumn, row: Record<string, unknown>) => {
    const raw = row[col.key];

    const valueType = col.valueType ?? 'auto';
    const resolved =
      valueType === 'i18n' ? resolveI18nValue(raw, locale) : resolveI18nValue(raw, locale);

    if (valueType === 'boolean') {
      return (
        <span
          className={clsx(
            'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
            resolved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600',
          )}
        >
          {resolved ? yesLabel : noLabel}
        </span>
      );
    }

    return (
      <span className="text-sm text-gray-800">{resolved == null ? '' : String(resolved)}</span>
    );
  };

  return (
    <div className={clsx('space-y-4', className)}>
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            {hasSearch && (
              <DebouncedSearchInput
                value={query.searchQuery ?? ''}
                onDebouncedChange={(next) => setQuery({ searchQuery: next })}
                placeholder={`${resolvedSearchPlaceholder}...`}
                containerClassName="w-full md:max-w-sm"
              />
            )}

            {filters && filters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {filters.map((f) => {
                  const field = findField(config, f.key);
                  const labelKey = f.label || (field ? String(field.label) : f.key);

                  const rawCurrent = query.filters?.[f.key] ?? null;
                  const current = Array.isArray(rawCurrent) ? (rawCurrent[0] ?? null) : rawCurrent;

                  if (f.type === 'boolean') {
                    return (
                      <label
                        key={f.key}
                        className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700"
                      >
                        <span className="font-semibold">{translate(t, labelKey)}</span>
                        <select
                          className="bg-transparent text-xs outline-none"
                          value={current === null ? 'all' : String(current)}
                          onChange={(e) => {
                            const v = e.target.value;
                            const nextVal = v === 'all' ? null : v === 'true';
                            setQuery({
                              filters: { ...(query.filters ?? {}), [f.key]: nextVal },
                            });
                          }}
                        >
                          <option value="all">{allLabel}</option>
                          <option value="true">{yesLabel}</option>
                          <option value="false">{noLabel}</option>
                        </select>
                      </label>
                    );
                  }

                  if (f.type === 'select' && f.options) {
                    return (
                      <label
                        key={f.key}
                        className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700"
                      >
                        <span className="font-semibold">{translate(t, labelKey)}</span>
                        <select
                          className="bg-transparent text-xs outline-none"
                          value={current == null ? '' : String(current)}
                          onChange={(e) => {
                            const v = e.target.value;
                            setQuery({
                              filters: { ...(query.filters ?? {}), [f.key]: v === '' ? null : v },
                            });
                          }}
                        >
                          <option value="">{allLabel}</option>
                          {f.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {translate(t, opt.label)}
                            </option>
                          ))}
                        </select>
                      </label>
                    );
                  }

                  // text filter
                  return (
                    <label
                      key={f.key}
                      className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700"
                    >
                      <span className="font-semibold">{translate(t, labelKey)}</span>
                      <input
                        className="w-28 bg-transparent text-xs outline-none placeholder:text-gray-400"
                        placeholder="..."
                        value={current == null ? '' : String(current)}
                        onChange={(e) =>
                          setQuery({
                            filters: { ...(query.filters ?? {}), [f.key]: e.target.value || null },
                          })
                        }
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            {newButton &&
              (newButton.href ? (
                <Button asChild>
                  <Link href={newButton.href}>{newButton.label}</Link>
                </Button>
              ) : (
                <Button type="button" onClick={newButton.onClick}>
                  {newButton.label}
                </Button>
              ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        <Table
          className={clsx('min-w-[760px] md:min-w-full', tableClassName)}
          containerClassName={clsx(
            'max-h-[70vh] overflow-auto overscroll-contain',
            tableContainerClassName,
          )}
        >
          <TableHead className={clsx(stickyHeader && 'sticky top-0 z-10')}>
            <TableRow className="hover:bg-gray-50">
              {columns.map((col) => {
                const field = findField(config, col.key);
                const labelKey = col.label || (field ? String(field.label) : col.key);
                const isSorted = query.sort?.key === col.key;
                const dir = isSorted ? query.sort?.direction : undefined;

                return (
                  <TableHeaderCell key={col.key} className={clsx('select-none', col.className)}>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
                      onClick={() => toggleSort(col.key)}
                    >
                      {translate(t, labelKey)}
                      {dir === 'asc' ? '↑' : dir === 'desc' ? '↓' : ''}
                    </button>
                  </TableHeaderCell>
                );
              })}
              {shouldShowActionsColumn ? (
                <TableHeaderCell className="text-right">{actionsLabel}</TableHeaderCell>
              ) : null}
            </TableRow>
          </TableHead>

          <TableBody>
            {error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (shouldShowActionsColumn ? 1 : 0)}
                  className="py-4 text-center"
                >
                  <AsyncState
                    variant="error"
                    title={errorLabel}
                    description={errorDescription ?? error}
                    actionLabel={onRetry ? retryLabel : undefined}
                    onAction={onRetry}
                    className="border-0 bg-transparent p-4"
                  />
                </TableCell>
              </TableRow>
            ) : loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (shouldShowActionsColumn ? 1 : 0)}
                  className="py-4 text-center"
                >
                  <AsyncState
                    variant="loading"
                    title={loadingLabel}
                    className="border-0 bg-transparent p-4"
                  />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (shouldShowActionsColumn ? 1 : 0)}
                  className="py-4 text-center"
                >
                  <AsyncState
                    variant="empty"
                    title={noResultsLabel}
                    description={emptyDescription}
                    className="border-0 bg-transparent p-4"
                  />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => {
                const id = getRowId ? getRowId(row, index) : String(row.id ?? index);
                const actions = actionsByRow[index] ?? [];
                const primaryAction = actions[0];
                const canClickRow = rowClickable && Boolean(primaryAction);

                return (
                  <TableRow
                    key={id}
                    className={clsx(canClickRow && 'cursor-pointer')}
                    role={canClickRow ? 'link' : undefined}
                    tabIndex={canClickRow ? 0 : undefined}
                    onClick={(event) => {
                      if (!canClickRow) return;
                      if (isInteractiveElement(event.target)) return;
                      runAction(primaryAction);
                    }}
                    onKeyDown={(event) => {
                      if (!canClickRow) return;
                      if (isInteractiveElement(event.target)) return;
                      if (event.key !== 'Enter' && event.key !== ' ') return;
                      event.preventDefault();
                      runAction(primaryAction);
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell key={`${id}-${col.key}`} className={col.className}>
                        {renderCellValue(col, row)}
                      </TableCell>
                    ))}
                    {shouldShowActionsColumn ? (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {actions.map((a, actionIndex) =>
                            a.href ? (
                              <Button key={a.href} asChild variant="ghost" size="sm">
                                <Link href={a.href}>{a.label}</Link>
                              </Button>
                            ) : (
                              <Button
                                key={`${id}-action-${actionIndex}-${a.label}`}
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={a.onClick}
                              >
                                {a.label}
                              </Button>
                            ),
                          )}
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <div className="border-t border-gray-200 p-4">
          <Pagination
            page={query.page}
            total={total}
            limit={query.limit}
            onPageChange={(p) => setQuery({ page: p })}
          />
        </div>
      </div>
    </div>
  );
}
