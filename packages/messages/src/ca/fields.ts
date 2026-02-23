import type { FieldsMessages } from '../types/fields';

export const fields: FieldsMessages = {
  fields: {
    base: {
      id: { label: 'ID' },
      createdAt: { label: 'Creat el' },
      updatedAt: { label: 'Actualitzat el' },
    },
    account: {
      accountCode: { label: 'Codi de compte' },
      email: { label: 'Correu electrònic' },
      role: { label: 'Rol' },
    },
    contactSubmission: {
      consent: { label: 'Consentiment' },
      email: { label: 'Correu electrònic' },
      lastPages: { label: 'Últimes pàgines' },
      locale: { label: 'Idioma' },
      message: { label: 'Missatge' },
      metadata: { label: 'Metadades' },
      name: { label: 'Nom' },
      source: { label: 'Origen' },
      status: { label: 'Estat' },
    },
    dynamicPage: {
      hero: { label: 'Hero' },
      isActive: { label: 'Actiu' },
      metadata: { label: 'Metadades' },
      pageCode: { label: 'Codi de pàgina' },
      sections: { label: 'Seccions' },
      seo: { label: 'SEO' },
      showOnPublicWeb: { label: 'Mostrar al web públic' },
      slug: { label: 'Slug' },
      status: { label: 'Estat' },
      webPriority: { label: 'Prioritat web' },
    },
  },
  options: {
    account: {
      role: {
        admin: { label: 'Admin' },
        user: { label: 'Usuari' },
      },
    },
    contactSubmission: {
      status: {
        archived: { label: 'Arxivat' },
        new: { label: 'Nou' },
      },
    },
    dynamicPage: {
      status: {
        archived: { label: 'Arxivat' },
        draft: { label: 'Esborrany' },
        published: { label: 'Publicat' },
      },
    },
  },
};
