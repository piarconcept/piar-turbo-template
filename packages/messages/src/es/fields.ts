import type { FieldsMessages } from '../types/fields';

export const fields: FieldsMessages = {
  fields: {
    base: {
      id: { label: 'ID' },
      createdAt: { label: 'Creado el' },
      updatedAt: { label: 'Actualizado el' },
    },
    account: {
      accountCode: { label: 'Código de cuenta' },
      email: { label: 'Correo electrónico' },
      role: { label: 'Rol' },
    },
    contactSubmission: {
      consent: { label: 'Consentimiento' },
      email: { label: 'Correo electrónico' },
      lastPages: { label: 'Últimas páginas' },
      locale: { label: 'Idioma' },
      message: { label: 'Mensaje' },
      metadata: { label: 'Metadatos' },
      name: { label: 'Nombre' },
      source: { label: 'Origen' },
      status: { label: 'Estado' },
    },
    dynamicPage: {
      hero: { label: 'Hero' },
      isActive: { label: 'Activo' },
      metadata: { label: 'Metadatos' },
      pageCode: { label: 'Código de página' },
      sections: { label: 'Secciones' },
      seo: { label: 'SEO' },
      showOnPublicWeb: { label: 'Mostrar en web pública' },
      slug: { label: 'Slug' },
      status: { label: 'Estado' },
      webPriority: { label: 'Prioridad web' },
    },
  },
  options: {
    account: {
      role: {
        admin: { label: 'Admin' },
        user: { label: 'Usuario' },
      },
    },
    contactSubmission: {
      status: {
        archived: { label: 'Archivado' },
        new: { label: 'Nuevo' },
      },
    },
    dynamicPage: {
      status: {
        archived: { label: 'Archivado' },
        draft: { label: 'Borrador' },
        published: { label: 'Publicado' },
      },
    },
  },
};
