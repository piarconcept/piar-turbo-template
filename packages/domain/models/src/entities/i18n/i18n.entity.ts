import type { SupportedLanguage } from '@piar/messages';

export interface I18nTextEntityProps {
  language: SupportedLanguage;
  value: string;
}

export class I18nTextEntity implements I18nTextEntityProps {
  language: SupportedLanguage;
  value: string;

  constructor(props: I18nTextEntityProps) {
    this.language = props.language;
    this.value = props.value;
  }
}
