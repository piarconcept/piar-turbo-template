/**
 * Minimal fields/options messages used by dynamic forms/tables in backoffice.
 */
export interface FieldsMessages {
  fields: {
    base: {
      id: { label: string };
      createdAt: { label: string };
      updatedAt: { label: string };
    };
    account: {
      accountCode: { label: string };
      email: { label: string };
      role: { label: string };
    };
    contactSubmission: {
      consent: { label: string };
      email: { label: string };
      lastPages: { label: string };
      locale: { label: string };
      message: { label: string };
      metadata: { label: string };
      name: { label: string };
      source: { label: string };
      status: { label: string };
    };
    dynamicPage: {
      hero: { label: string };
      isActive: { label: string };
      metadata: { label: string };
      pageCode: { label: string };
      sections: { label: string };
      seo: { label: string };
      showOnPublicWeb: { label: string };
      slug: { label: string };
      status: { label: string };
      webPriority: { label: string };
    };
  };
  options: {
    account: {
      role: {
        admin: { label: string };
        user: { label: string };
      };
    };
    contactSubmission: {
      status: {
        archived: { label: string };
        new: { label: string };
      };
    };
    dynamicPage: {
      status: {
        archived: { label: string };
        draft: { label: string };
        published: { label: string };
      };
    };
  };
}
