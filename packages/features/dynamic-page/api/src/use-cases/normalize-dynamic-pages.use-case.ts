import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';
import type {
  DynamicPageCTA,
  DynamicPageEntityProps,
  DynamicPageHero,
  DynamicPageItem,
  DynamicPageMedia,
  DynamicPageSection,
  DynamicPageSectionBackground,
  DynamicPageSectionGroup,
  DynamicPageSectionLayout,
  DynamicPageSectionType,
  I18nText,
} from '@piar/domain-models';
import type {
  IDynamicPageRepository,
  UpdateDynamicPagePayload,
} from '@piar/dynamic-page-configuration';

export interface NormalizeDynamicPagesOptions {
  publish?: boolean;
}

export interface NormalizeDynamicPagesResult {
  total: number;
  updated: number;
  skipped: number;
  failures: Array<{ id: string; pageCode: string; slug: string; reason: string }>;
}

export interface NormalizeDynamicPagesUseCase {
  execute(options?: NormalizeDynamicPagesOptions): Promise<NormalizeDynamicPagesResult>;
}

export const NormalizeDynamicPagesUseCase = Symbol('NormalizeDynamicPagesUseCase');

const SUPPORTED_LANGUAGES = ['es', 'ca', 'en'] as const;
const ALLOWED_SECTION_TYPES: DynamicPageSectionType[] = [
  'text',
  'features',
  'stats',
  'steps',
  'cta',
  'faq',
  'testimonials',
  'gallery',
  'cards',
  'links',
  'tags',
  'logos',
  'contact',
  'custom',
];
const ALLOWED_LAYOUTS: DynamicPageSectionLayout[] = ['stack', 'grid', 'list', 'carousel'];
const ALLOWED_BACKGROUNDS: DynamicPageSectionBackground[] = ['none', 'light', 'dark', 'accent'];
const ALLOWED_CTA_VARIANTS: Array<NonNullable<DynamicPageCTA['variant']>> = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'link',
];
const ALLOWED_HERO_ALIGNMENTS: Array<NonNullable<DynamicPageHero['alignment']>> = [
  'left',
  'center',
  'right',
];
const ALLOWED_STATUS = ['draft', 'published', 'archived'] as const;

function cleanString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function normalizeTags(value: unknown): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    const cleaned = value.map((tag) => String(tag).trim()).filter((tag) => tag.length > 0);
    return cleaned.length ? Array.from(new Set(cleaned)) : undefined;
  }
  if (typeof value === 'string') {
    const cleaned = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    return cleaned.length ? Array.from(new Set(cleaned)) : undefined;
  }
  return undefined;
}

function buildFixedI18nText(values: Record<string, string>, fallback: string): I18nText {
  return normalizeI18nValue(values) ?? normalizeI18nValue(fallback) ?? [];
}

function buildGenericCtaSection(order: number, key = 'final-cta'): DynamicPageSection {
  return {
    key,
    type: 'cta',
    title: buildFixedI18nText(
      {
        es: '¿Buscas un producto o servicio a medida?',
        ca: 'Busques un producte o servei a mida?',
        en: 'Looking for a tailored product or service?',
      },
      'Looking for a tailored product or service?',
    ),
    subtitle: buildFixedI18nText(
      {
        es: 'CONTACTO',
        ca: 'CONTACTE',
        en: 'CONTACT',
      },
      'CONTACT',
    ),
    description: buildFixedI18nText(
      {
        es: 'Si te interesa trabajar con nosotros, cuéntanos tu objetivo y diseñaremos una solución a tu medida, con visión estratégica y ejecución impecable.',
        ca: "Si t'interessa treballar amb nosaltres, explica'ns el teu objectiu i dissenyarem una solució a mida, amb visió estratègica i una execució impecable.",
        en: 'If you want to work with us, tell us your goal and we will design a solution made for you, with strategic clarity and solid execution.',
      },
      'If you want to work with us, tell us your goal and we will design a solution made for you.',
    ),
    cta: {
      label: buildFixedI18nText(
        {
          es: 'Contactar',
          ca: 'Contactar',
          en: 'Contact us',
        },
        'Contact us',
      ),
      link: '/contact',
      variant: 'primary',
      newTab: false,
    },
    layout: 'stack',
    background: 'dark',
    order,
  };
}

function buildI18nEntries(entries: Map<string, string>): I18nText | undefined {
  if (!entries.size) return undefined;
  const fallback =
    entries.get('es') || entries.get('ca') || entries.get('en') || entries.values().next().value;
  if (!fallback) return undefined;
  const normalized = SUPPORTED_LANGUAGES.map((lang) => {
    const value = entries.get(lang) ?? fallback;
    if (!value) return null;
    return {
      language: lang as I18nText[number]['language'],
      value,
    };
  }).filter((entry): entry is I18nText[number] => Boolean(entry));
  return normalized.length ? normalized : undefined;
}

function normalizeI18nValue(value: unknown): I18nText | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const entries = new Map<string, string>();
    for (const lang of SUPPORTED_LANGUAGES) {
      entries.set(lang, trimmed);
    }
    return buildI18nEntries(entries);
  }
  if (Array.isArray(value)) {
    const entries = new Map<string, string>();
    for (const item of value) {
      if (!item || typeof item !== 'object') continue;
      const language = cleanString((item as { language?: unknown }).language);
      const entryValue = cleanString((item as { value?: unknown }).value);
      if (!language || !entryValue) continue;
      if (SUPPORTED_LANGUAGES.includes(language as (typeof SUPPORTED_LANGUAGES)[number])) {
        if (!entries.has(language)) entries.set(language, entryValue);
      }
    }
    return buildI18nEntries(entries);
  }
  if (typeof value === 'object') {
    const entries = new Map<string, string>();
    for (const lang of SUPPORTED_LANGUAGES) {
      const raw = (value as Record<string, unknown>)[lang];
      const entryValue =
        cleanString(raw ?? undefined) ?? (typeof raw === 'number' ? String(raw) : undefined);
      if (entryValue) entries.set(lang, entryValue);
    }
    return buildI18nEntries(entries);
  }
  return undefined;
}

function normalizeCta(cta?: DynamicPageCTA | null): DynamicPageCTA | undefined {
  if (!cta) return undefined;
  const label = normalizeI18nValue(cta.label);
  const link = cleanString(cta.link);
  if (!label || !link) return undefined;
  const variant = ALLOWED_CTA_VARIANTS.includes(cta.variant ?? 'primary') ? cta.variant : undefined;
  return {
    label,
    link,
    variant,
    newTab: cta.newTab === true,
  };
}

function normalizeMedia(media?: DynamicPageMedia | null): DynamicPageMedia | undefined {
  if (!media) return undefined;
  const videoUrl = cleanString(media.videoUrl);
  const videoPosterUrl = cleanString(media.videoPosterUrl);
  if (!videoUrl) return undefined;
  return {
    videoUrl,
    videoPosterUrl,
  };
}

function toTitleCase(value: string) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeHero(
  page: DynamicPageEntityProps,
  normalizedSeoTitle?: I18nText,
  normalizedSeoDescription?: I18nText,
): DynamicPageHero {
  const base = page.hero ?? ({} as DynamicPageHero);
  const fallbackTitle =
    normalizeI18nValue(page.pageCode ? toTitleCase(page.pageCode) : undefined) ??
    normalizeI18nValue(page.slug ? toTitleCase(page.slug) : undefined);
  const title = normalizeI18nValue(base.title) ?? normalizedSeoTitle ?? fallbackTitle;
  const subtitle = normalizeI18nValue(base.subtitle) ?? normalizedSeoDescription;
  const description = normalizeI18nValue(base.description);
  const eyebrow = normalizeI18nValue(base.eyebrow);
  const primaryCta = normalizeCta(base.primaryCta);
  const secondaryCta = normalizeCta(base.secondaryCta);
  const media = normalizeMedia(base.media);
  const alignment = ALLOWED_HERO_ALIGNMENTS.includes(base.alignment ?? 'left')
    ? base.alignment
    : 'left';
  const theme: DynamicPageHero['theme'] = 'dark';

  return {
    eyebrow,
    title: title ?? normalizeI18nValue('Dynamic Page') ?? [],
    subtitle,
    description,
    primaryCta,
    secondaryCta,
    media,
    alignment,
    theme,
  };
}

function normalizeItem(
  item: DynamicPageItem,
  sectionIndex: number,
  itemIndex: number,
): DynamicPageItem | null {
  const key = cleanString(item.key) ?? `item-${sectionIndex + 1}-${itemIndex + 1}`;
  const title = normalizeI18nValue(item.title);
  const subtitle = normalizeI18nValue(item.subtitle);
  const description = normalizeI18nValue(item.description);
  const icon = cleanString(item.icon);
  const link = cleanString(item.link);
  const cta = normalizeCta(item.cta);
  const tags = normalizeTags(item.tags);
  const order = Number.isFinite(item.order) ? item.order : itemIndex + 1;
  const metadata =
    item.metadata && typeof item.metadata === 'object' && !Array.isArray(item.metadata)
      ? item.metadata
      : undefined;

  const hasContent = Boolean(
    title || subtitle || description || link || cta || (tags && tags.length),
  );

  if (!hasContent) return null;

  return {
    key,
    title,
    subtitle,
    description,
    icon,
    link,
    cta,
    tags,
    order,
    metadata,
  };
}

function normalizeGroup(
  group: DynamicPageSectionGroup,
  sectionIndex: number,
  groupIndex: number,
): DynamicPageSectionGroup | null {
  const key = cleanString(group.key) ?? `group-${sectionIndex + 1}-${groupIndex + 1}`;
  const title = normalizeI18nValue(group.title);
  const subtitle = normalizeI18nValue(group.subtitle);
  const description = normalizeI18nValue(group.description);
  const items = (group.items ?? [])
    .map((item, itemIndex) => normalizeItem(item, sectionIndex, itemIndex))
    .filter((item): item is DynamicPageItem => Boolean(item))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item, itemIndex) => ({
      ...item,
      order: itemIndex + 1,
    }));
  const order = Number.isFinite(group.order) ? group.order : groupIndex + 1;
  const metadata =
    group.metadata && typeof group.metadata === 'object' && !Array.isArray(group.metadata)
      ? group.metadata
      : undefined;

  const hasContent = Boolean(title || subtitle || description || items.length);
  if (!hasContent) return null;

  return {
    key,
    title,
    subtitle,
    description,
    items,
    order,
    metadata,
  };
}

function resolveSectionType(
  type: DynamicPageSectionType | undefined,
  normalizedItems: DynamicPageItem[],
  normalizedGroups: DynamicPageSectionGroup[],
  normalizedCta?: DynamicPageCTA,
): DynamicPageSectionType {
  if (type && ALLOWED_SECTION_TYPES.includes(type)) return type;
  if (normalizedCta && normalizedItems.length === 0 && normalizedGroups.length === 0) {
    return 'cta';
  }
  const hasTags = normalizedItems.some((item) => item.tags && item.tags.length);
  if (hasTags) return 'tags';
  const hasLinksOnly =
    normalizedItems.length > 0 &&
    normalizedItems.every((item) => item.link && !item.description && !item.subtitle);
  if (hasLinksOnly) return 'links';
  return 'text';
}

function resolveSectionLayout(
  layout: DynamicPageSectionLayout | undefined,
  type: DynamicPageSectionType,
): DynamicPageSectionLayout {
  if (layout && ALLOWED_LAYOUTS.includes(layout)) return layout;
  switch (type) {
    case 'features':
    case 'stats':
    case 'testimonials':
    case 'gallery':
    case 'cards':
    case 'logos':
    case 'links':
      return 'grid';
    case 'steps':
    case 'faq':
      return 'list';
    case 'cta':
    case 'contact':
    case 'text':
    case 'tags':
    case 'custom':
    default:
      return 'stack';
  }
}

function resolveSectionBackground(
  background: DynamicPageSectionBackground | undefined,
  type: DynamicPageSectionType,
): DynamicPageSectionBackground | undefined {
  if (background && ALLOWED_BACKGROUNDS.includes(background)) {
    if (background === 'dark' || background === 'none') return background;
  }
  if (type === 'cta') return 'dark';
  return 'none';
}

function normalizeSection(
  section: DynamicPageSection,
  sectionIndex: number,
): DynamicPageSection | null {
  const normalizedItems = (section.items ?? [])
    .map((item, itemIndex) => normalizeItem(item, sectionIndex, itemIndex))
    .filter((item): item is DynamicPageItem => Boolean(item));
  const normalizedGroups = (section.groups ?? [])
    .map((group, groupIndex) => normalizeGroup(group, sectionIndex, groupIndex))
    .filter((group): group is DynamicPageSectionGroup => Boolean(group));
  const normalizedCta = normalizeCta(section.cta);
  const type = resolveSectionType(section.type, normalizedItems, normalizedGroups, normalizedCta);
  const layout = resolveSectionLayout(section.layout, type);
  const background = resolveSectionBackground(section.background, type);
  const title = normalizeI18nValue(section.title);
  const subtitle = normalizeI18nValue(section.subtitle);
  const description = normalizeI18nValue(section.description);
  const media = normalizeMedia(section.media);
  const key = cleanString(section.key) ?? `section-${sectionIndex + 1}`;
  const order = Number.isFinite(section.order) ? section.order : sectionIndex + 1;
  const metadata =
    section.metadata && typeof section.metadata === 'object' && !Array.isArray(section.metadata)
      ? section.metadata
      : undefined;

  const hasContent =
    Boolean(
      title || subtitle || description || normalizedItems.length || normalizedGroups.length,
    ) || Boolean(media || normalizedCta);

  if (!hasContent) return null;

  return {
    key,
    type,
    title,
    subtitle,
    description,
    cta: normalizedCta,
    items: normalizedItems
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item, index) => ({ ...item, order: index + 1 })),
    groups: normalizedGroups
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((group, index) => ({ ...group, order: index + 1 })),
    media,
    layout,
    background,
    order,
    metadata,
  };
}

function normalizeSeo(seo: DynamicPageEntityProps['seo']) {
  if (!seo) return undefined;
  const title = normalizeI18nValue(seo.title);
  const description = normalizeI18nValue(seo.description);
  const canonicalUrl = cleanString(seo.canonicalUrl);
  const noIndex = seo.noIndex === true ? true : seo.noIndex === false ? false : undefined;
  const noFollow = seo.noFollow === true ? true : seo.noFollow === false ? false : undefined;

  if (!title && !description && !canonicalUrl && noIndex == null && noFollow == null) {
    return undefined;
  }

  return {
    title,
    description,
    canonicalUrl,
    noIndex,
    noFollow,
  };
}

function normalizeDynamicPage(
  page: DynamicPageEntityProps,
  options?: NormalizeDynamicPagesOptions,
): Omit<DynamicPageEntityProps, 'id' | 'createdAt' | 'updatedAt'> {
  const pageCode = cleanString(page.pageCode) ?? page.pageCode;
  const slug = cleanString(page.slug) ?? page.slug;
  const seo = normalizeSeo(page.seo);
  const hero = normalizeHero(page, seo?.title, seo?.description);
  const sections: DynamicPageSection[] = (page.sections ?? [])
    .map((section, index) => normalizeSection(section, index))
    .filter((section): section is DynamicPageSection => Boolean(section))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((section, index) => ({
      ...section,
      order: index + 1,
    }));
  let normalizedSections: DynamicPageSection[] = [...sections];
  if (normalizedSections.length === 0) {
    normalizedSections = [buildGenericCtaSection(1)];
  } else {
    const lastSection = normalizedSections[normalizedSections.length - 1];
    if (lastSection.type === 'cta') {
      normalizedSections[normalizedSections.length - 1] = buildGenericCtaSection(
        normalizedSections.length,
        lastSection.key,
      );
    } else {
      normalizedSections.push(buildGenericCtaSection(normalizedSections.length + 1));
    }
  }
  normalizedSections = normalizedSections.map((section, index) => ({
    ...section,
    order: index + 1,
  }));

  const metadata =
    page.metadata && typeof page.metadata === 'object' && !Array.isArray(page.metadata)
      ? page.metadata
      : undefined;

  const status = options?.publish
    ? 'published'
    : page.status && ALLOWED_STATUS.includes(page.status)
      ? page.status
      : undefined;
  const isActive = options?.publish ? true : page.isActive;
  const showOnPublicWeb = options?.publish ? true : page.showOnPublicWeb;
  const webPriority = Number.isFinite(page.webPriority) ? page.webPriority : undefined;

  return {
    pageCode,
    slug,
    status,
    hero,
    sections: normalizedSections,
    seo,
    isActive,
    webPriority,
    showOnPublicWeb,
    metadata,
  };
}

async function listAllPages(repository: IDynamicPageRepository): Promise<DynamicPageEntityProps[]> {
  const limit = 50;
  let page = 1;
  const all: DynamicPageEntityProps[] = [];

  while (true) {
    const query: DynamicQuery = { page, limit };
    const result: PaginatedResult<DynamicPageEntityProps> = await repository.list(query);
    all.push(...result.rows);
    if (all.length >= result.total || result.rows.length === 0) break;
    page += 1;
  }

  return all;
}

export class NormalizeDynamicPagesUseCaseExecuter implements NormalizeDynamicPagesUseCase {
  constructor(private readonly repository: IDynamicPageRepository) {}

  async execute(options?: NormalizeDynamicPagesOptions): Promise<NormalizeDynamicPagesResult> {
    const pages = await listAllPages(this.repository);
    const failures: NormalizeDynamicPagesResult['failures'] = [];

    let updated = 0;

    for (const page of pages) {
      try {
        const normalized = normalizeDynamicPage(page, options);
        const payload: UpdateDynamicPagePayload = {
          id: page.id,
          ...normalized,
        };
        await this.repository.update(payload);
        updated += 1;
      } catch (error) {
        failures.push({
          id: page.id,
          pageCode: page.pageCode,
          slug: page.slug,
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      total: pages.length,
      updated,
      skipped: pages.length - updated,
      failures,
    };
  }
}
