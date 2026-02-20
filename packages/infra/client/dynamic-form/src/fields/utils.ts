import type { FieldOption } from '@piar/domain-fields';

function translate(t: ((key: string) => string) | undefined, key?: string) {
  if (!key) return '';
  try {
    return t ? t(key) : key;
  } catch {
    return key;
  }
}

function translateWithFallback(
  t: ((key: string) => string) | undefined,
  key: string,
  fallback: string,
): string {
  if (!t) return fallback;
  try {
    const value = t(key);
    if (!value || value === key) return fallback;
    return value;
  } catch {
    return fallback;
  }
}

function normalizeOptions(options?: FieldOption[], t?: (key: string) => string) {
  return (options ?? []).map((o) => ({
    value: String(o.value),
    label: translate(t, o.label),
    disabled: o.disabled,
  }));
}

const toString = (value: unknown) => (value == null ? '' : String(value));

function formatDateInputValue(value: unknown) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function parseNumberValue(raw: string) {
  if (!raw) return undefined;
  const next = Number(raw);
  return Number.isNaN(next) ? undefined : next;
}

export {
  formatDateInputValue,
  normalizeOptions,
  parseNumberValue,
  toString,
  translate,
  translateWithFallback,
};
