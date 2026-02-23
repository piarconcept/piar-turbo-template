import type { FieldsMessages } from '../types/fields';

export const fields: FieldsMessages = {
  fields: {
    base: {
      id: { label: 'ID' },
      createdAt: { label: 'Created At' },
      updatedAt: { label: 'Updated At' },
    },
    account: {
      accountCode: { label: 'Account Code' },
      email: { label: 'Email' },
      role: { label: 'Role' },
    },
    contactSubmission: {
      consent: { label: 'Consent' },
      email: { label: 'Email' },
      lastPages: { label: 'Last Pages' },
      locale: { label: 'Locale' },
      message: { label: 'Message' },
      metadata: { label: 'Metadata' },
      name: { label: 'Name' },
      source: { label: 'Source' },
      status: { label: 'Status' },
    },
    dynamicPage: {
      hero: { label: 'Hero' },
      isActive: { label: 'Is Active' },
      metadata: { label: 'Metadata' },
      pageCode: { label: 'Page Code' },
      sections: { label: 'Sections' },
      seo: { label: 'SEO' },
      showOnPublicWeb: { label: 'Show On Public Web' },
      slug: { label: 'Slug' },
      status: { label: 'Status' },
      webPriority: { label: 'Web Priority' },
    },
  },
  options: {
    account: {
      role: {
        admin: { label: 'Admin' },
        user: { label: 'User' },
      },
    },
    contactSubmission: {
      status: {
        archived: { label: 'Archived' },
        new: { label: 'New' },
      },
    },
    dynamicPage: {
      status: {
        archived: { label: 'Archived' },
        draft: { label: 'Draft' },
        published: { label: 'Published' },
      },
    },
  },
};
