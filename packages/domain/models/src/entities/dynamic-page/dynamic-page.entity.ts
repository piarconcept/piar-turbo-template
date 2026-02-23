import { BaseEntity, BaseEntityProps } from '../base/base.entity.js';
import type { I18nText } from '../i18n/i18n.entity.js';

export type DynamicPageStatus = 'draft' | 'published' | 'archived';

export type DynamicPageCtaVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

export interface DynamicPageCTA {
  label: I18nText;
  link: string;
  variant?: DynamicPageCtaVariant;
  newTab?: boolean;
}

export interface DynamicPageMedia {
  imageUrl?: string;
  imageAlt?: I18nText;
  videoUrl?: string;
  videoPosterUrl?: string;
}

export type DynamicPageHeroAlignment = 'left' | 'center' | 'right';
export type DynamicPageHeroTheme = 'light' | 'dark' | 'custom';

export interface DynamicPageHero {
  eyebrow?: I18nText;
  title: I18nText;
  subtitle?: I18nText;
  description?: I18nText;
  primaryCta?: DynamicPageCTA;
  secondaryCta?: DynamicPageCTA;
  media?: DynamicPageMedia;
  alignment?: DynamicPageHeroAlignment;
  theme?: DynamicPageHeroTheme;
}

export type DynamicPageSectionType =
  | 'text'
  | 'features'
  | 'stats'
  | 'steps'
  | 'cta'
  | 'faq'
  | 'testimonials'
  | 'gallery'
  | 'cards'
  | 'links'
  | 'tags'
  | 'logos'
  | 'contact'
  | 'custom';

export type DynamicPageSectionLayout = 'stack' | 'grid' | 'list' | 'carousel';
export type DynamicPageSectionBackground = 'none' | 'light' | 'dark' | 'accent';

export interface DynamicPageItem {
  key: string;
  title?: I18nText;
  subtitle?: I18nText;
  description?: I18nText;
  icon?: string;
  imageUrl?: string;
  link?: string;
  cta?: DynamicPageCTA;
  tags?: string[];
  order?: number;
  metadata?: Record<string, unknown>;
}

export interface DynamicPageSectionGroup {
  key: string;
  title?: I18nText;
  subtitle?: I18nText;
  description?: I18nText;
  items?: DynamicPageItem[];
  order?: number;
  metadata?: Record<string, unknown>;
}

export interface DynamicPageSection {
  key: string;
  type: DynamicPageSectionType;
  title?: I18nText;
  subtitle?: I18nText;
  description?: I18nText;
  cta?: DynamicPageCTA;
  items?: DynamicPageItem[];
  groups?: DynamicPageSectionGroup[];
  media?: DynamicPageMedia;
  layout?: DynamicPageSectionLayout;
  background?: DynamicPageSectionBackground;
  order?: number;
  metadata?: Record<string, unknown>;
}

export interface DynamicPageSeo {
  title?: I18nText;
  description?: I18nText;
  imageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface DynamicPageEntityProps extends BaseEntityProps {
  pageCode: string;
  slug: string;
  status?: DynamicPageStatus;
  hero: DynamicPageHero;
  sections?: DynamicPageSection[];
  seo?: DynamicPageSeo;
  isActive?: boolean;
  webPriority?: number;
  showOnPublicWeb?: boolean;
  metadata?: Record<string, unknown>;
}

export class DynamicPageEntity extends BaseEntity implements DynamicPageEntityProps {
  pageCode: string;
  slug: string;
  status?: DynamicPageStatus;
  hero: DynamicPageHero;
  sections?: DynamicPageSection[];
  seo?: DynamicPageSeo;
  isActive?: boolean;
  webPriority?: number;
  showOnPublicWeb?: boolean;
  metadata?: Record<string, unknown>;

  constructor(props: DynamicPageEntityProps) {
    super(props);
    this.pageCode = props.pageCode;
    this.slug = props.slug;
    this.status = props.status;
    this.hero = props.hero;
    this.sections = props.sections;
    this.seo = props.seo;
    this.isActive = props.isActive;
    this.webPriority = props.webPriority;
    this.showOnPublicWeb = props.showOnPublicWeb;
    this.metadata = props.metadata;
  }
}
