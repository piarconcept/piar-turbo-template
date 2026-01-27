/**
 * Legal template messages used by privacy/terms/cookies pages.
 * All fields are content-only strings ready for translation.
 */
export interface LegalTemplateSectionMessages {
  title: string;
  body: string[];
  bullets?: string[];
  note?: string;
  subsections?: LegalTemplateSectionMessages[];
}

export interface LegalTemplateMessages {
  title: string;
  intro?: string;
  updatedAt?: string;
  sections: LegalTemplateSectionMessages[];
  contact?: {
    label: string;
    emailLabel?: string;
    addressLabel?: string;
  };
  footerNote?: string;
  backToLegalLabel?: string;
}
