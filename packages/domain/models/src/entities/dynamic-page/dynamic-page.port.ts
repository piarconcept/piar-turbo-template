import { BasePort } from '../base/base.port';
import { DynamicPageEntityProps } from './dynamic-page.entity';

export interface DynamicPagePort extends BasePort<DynamicPageEntityProps> {
  getByPageCode(pageCode: string): Promise<DynamicPageEntityProps | null>;
  getBySlug(slug: string): Promise<DynamicPageEntityProps | null>;
}

export const DynamicPagePort = Symbol('DynamicPagePort');
