/**
 * Schema.org types for structured data
 * Based on Schema.org vocabulary: https://schema.org/
 */

/**
 * Base Thing type - all Schema.org types extend this
 */
export interface Thing {
  '@context': 'https://schema.org';
  '@type': string;
  '@id'?: string;
  name?: string;
  description?: string;
  url?: string;
  image?: string | ImageObject | ImageObject[];
  sameAs?: string[];
}

/**
 * Organization schema
 * https://schema.org/Organization
 */
export interface Organization extends Thing {
  '@type': 'Organization';
  legalName?: string;
  logo?: ImageObject;
  founder?: Person | Person[];
  foundingDate?: string;
  address?: PostalAddress;
  contactPoint?: ContactPoint[];
  email?: string;
  telephone?: string;
  faxNumber?: string;
  vatID?: string;
  taxID?: string;
  duns?: string;
  numberOfEmployees?: number;
  slogan?: string;
}

/**
 * Person schema
 * https://schema.org/Person
 */
export interface Person extends Thing {
  '@type': 'Person';
  givenName?: string;
  familyName?: string;
  email?: string;
  telephone?: string;
  jobTitle?: string;
  worksFor?: Organization;
  address?: PostalAddress;
  birthDate?: string;
  gender?: string;
  nationality?: string;
}

/**
 * WebSite schema
 * https://schema.org/WebSite
 */
export interface WebSite extends Thing {
  '@type': 'WebSite';
  publisher?: Organization;
  potentialAction?: SearchAction;
  copyrightYear?: number;
  copyrightHolder?: Organization | Person;
  inLanguage?: string;
}

/**
 * SearchAction schema for site search
 */
export interface SearchAction {
  '@type': 'SearchAction';
  target: {
    '@type': 'EntryPoint';
    urlTemplate: string;
  };
  'query-input': string;
}

/**
 * Article schema
 * https://schema.org/Article
 */
export interface Article extends Thing {
  '@type': 'Article' | 'NewsArticle' | 'BlogPosting' | 'ScholarlyArticle';
  headline: string;
  author: Person | Organization | (Person | Organization)[];
  publisher: Organization;
  datePublished: string;
  dateModified?: string;
  articleBody?: string;
  articleSection?: string;
  wordCount?: number;
  inLanguage?: string;
  mainEntityOfPage?: string;
}

/**
 * BreadcrumbList schema
 * https://schema.org/BreadcrumbList
 */
export interface BreadcrumbList extends Thing {
  '@type': 'BreadcrumbList';
  itemListElement: ListItem[];
}

/**
 * ListItem for BreadcrumbList
 */
export interface ListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

/**
 * Product schema
 * https://schema.org/Product
 */
export interface Product extends Thing {
  '@type': 'Product';
  brand?: Organization | string;
  manufacturer?: Organization;
  model?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  offers?: Offer | Offer[];
  aggregateRating?: AggregateRating;
  review?: Review | Review[];
  releaseDate?: string;
  category?: string;
}

/**
 * Offer schema
 * https://schema.org/Offer
 */
export interface Offer {
  '@type': 'Offer';
  price: string | number;
  priceCurrency: string;
  priceValidUntil?: string;
  availability?: string;
  url?: string;
  seller?: Organization | Person;
  itemCondition?: string;
  shippingDetails?: OfferShippingDetails;
}

/**
 * OfferShippingDetails schema
 */
export interface OfferShippingDetails {
  '@type': 'OfferShippingDetails';
  shippingRate?: MonetaryAmount;
  shippingDestination?: DefinedRegion;
  deliveryTime?: ShippingDeliveryTime;
}

/**
 * MonetaryAmount schema
 */
export interface MonetaryAmount {
  '@type': 'MonetaryAmount';
  value: string | number;
  currency: string;
}

/**
 * DefinedRegion schema
 */
export interface DefinedRegion {
  '@type': 'DefinedRegion';
  addressCountry?: string;
  addressRegion?: string;
}

/**
 * ShippingDeliveryTime schema
 */
export interface ShippingDeliveryTime {
  '@type': 'ShippingDeliveryTime';
  handlingTime?: QuantitativeValue;
  transitTime?: QuantitativeValue;
}

/**
 * QuantitativeValue schema
 */
export interface QuantitativeValue {
  '@type': 'QuantitativeValue';
  minValue?: number;
  maxValue?: number;
  unitCode?: string;
}

/**
 * AggregateRating schema
 * https://schema.org/AggregateRating
 */
export interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  ratingCount?: number;
  reviewCount?: number;
  bestRating?: number;
  worstRating?: number;
}

/**
 * Review schema
 * https://schema.org/Review
 */
export interface Review {
  '@type': 'Review';
  author: Person | Organization;
  datePublished?: string;
  reviewBody?: string;
  reviewRating?: Rating;
  name?: string;
}

/**
 * Rating schema
 */
export interface Rating {
  '@type': 'Rating';
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
}

/**
 * LocalBusiness schema
 * https://schema.org/LocalBusiness
 */
export interface LocalBusiness extends Omit<Organization, '@type'> {
  '@type': 'LocalBusiness' | 'Store' | 'Restaurant' | 'Hotel';
  priceRange?: string;
  openingHoursSpecification?: OpeningHoursSpecification[];
  geo?: GeoCoordinates;
  aggregateRating?: AggregateRating;
  review?: Review | Review[];
}

/**
 * OpeningHoursSpecification schema
 */
export interface OpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
  validFrom?: string;
  validThrough?: string;
}

/**
 * GeoCoordinates schema
 */
export interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
  elevation?: number;
}

/**
 * PostalAddress schema
 */
export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

/**
 * ContactPoint schema
 */
export interface ContactPoint {
  '@type': 'ContactPoint';
  telephone?: string;
  contactType?: string;
  email?: string;
  areaServed?: string;
  availableLanguage?: string[];
  contactOption?: string;
}

/**
 * ImageObject schema
 */
export interface ImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
  caption?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  encodingFormat?: string;
}

/**
 * Event schema
 * https://schema.org/Event
 */
export interface Event extends Thing {
  '@type': 'Event';
  startDate: string;
  endDate?: string;
  location?: Place | VirtualLocation;
  organizer?: Organization | Person;
  performer?: Person | Organization | (Person | Organization)[];
  offers?: Offer | Offer[];
  eventStatus?: string;
  eventAttendanceMode?: string;
}

/**
 * Place schema
 */
export interface Place extends Thing {
  '@type': 'Place';
  address?: PostalAddress;
  geo?: GeoCoordinates;
  telephone?: string;
}

/**
 * VirtualLocation schema
 */
export interface VirtualLocation {
  '@type': 'VirtualLocation';
  url: string;
}

/**
 * FAQPage schema
 * https://schema.org/FAQPage
 */
export interface FAQPage extends Thing {
  '@type': 'FAQPage';
  mainEntity: Question[];
}

/**
 * Question schema
 */
export interface Question {
  '@type': 'Question';
  name: string;
  acceptedAnswer: Answer;
}

/**
 * Answer schema
 */
export interface Answer {
  '@type': 'Answer';
  text: string;
}

/**
 * HowTo schema
 * https://schema.org/HowTo
 */
export interface HowTo extends Thing {
  '@type': 'HowTo';
  step: HowToStep[];
  totalTime?: string;
  estimatedCost?: MonetaryAmount;
  tool?: string | Thing | (string | Thing)[];
  supply?: string | Thing | (string | Thing)[];
}

/**
 * HowToStep schema
 */
export interface HowToStep {
  '@type': 'HowToStep';
  name?: string;
  text: string;
  url?: string;
  image?: string | ImageObject;
}

/**
 * VideoObject schema
 * https://schema.org/VideoObject
 */
export interface VideoObject extends Thing {
  '@type': 'VideoObject';
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string | ImageObject;
  transcript?: string;
}
