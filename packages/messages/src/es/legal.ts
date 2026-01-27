import type { LegalMessages } from '../types/legal';

export const legal: LegalMessages = {
  index: {
    title: 'Legal',
    description: 'Documentos legales esenciales de este producto.',
    privacyLabel: 'Política de privacidad',
    privacyDescription: 'Cómo tratamos los datos personales.',
    termsLabel: 'Términos del servicio',
    termsDescription: 'Reglas de uso y responsabilidades.',
    cookiesLabel: 'Política de cookies',
    cookiesDescription: 'Detalles sobre cookies y seguimiento.',
  },
  privacy: {
    title: 'Política de privacidad',
    intro: 'Este es un texto de ejemplo. Sustitúyelo por tu política oficial.',
    updatedAt: 'Última actualización: 27 de enero de 2026',
    sections: [
      {
        title: 'Información que recopilamos',
        body: ['Describe las categorías de datos personales recopilados y su uso.'],
        bullets: ['Información de contacto', 'Datos de cuenta', 'Analítica de uso'],
      },
      {
        title: 'Cómo usamos la información',
        body: ['Explica la base legal y los fines del tratamiento.'],
      },
      {
        title: 'Tus derechos',
        body: ['Indica cómo acceder, actualizar o eliminar tus datos.'],
      },
    ],
    contact: {
      label: 'Contacto de privacidad',
      emailLabel: 'Email',
      addressLabel: 'Dirección',
    },
    footerNote: 'Sustituye este contenido por tu política de privacidad oficial.',
    backToLegalLabel: 'Volver a legal',
  },
  terms: {
    title: 'Términos del servicio',
    intro: 'Este es un texto de ejemplo. Sustitúyelo por tus términos oficiales.',
    updatedAt: 'Última actualización: 27 de enero de 2026',
    sections: [
      {
        title: 'Reglas de uso',
        body: ['Resume el uso permitido y las conductas prohibidas.'],
      },
      {
        title: 'Cuentas y seguridad',
        body: ['Define responsabilidades sobre credenciales y acceso.'],
      },
      {
        title: 'Responsabilidad',
        body: ['Aclara limitaciones de responsabilidad y exenciones.'],
      },
    ],
    contact: {
      label: 'Contacto de términos',
      emailLabel: 'Email',
      addressLabel: 'Dirección',
    },
    footerNote: 'Sustituye este contenido por tus términos oficiales.',
    backToLegalLabel: 'Volver a legal',
  },
  cookies: {
    title: 'Política de cookies',
    intro: 'Este es un texto de ejemplo. Sustitúyelo por tu política oficial.',
    updatedAt: 'Última actualización: 27 de enero de 2026',
    sections: [
      {
        title: '¿Qué son las cookies?',
        body: ['Explica qué son las cookies y cómo se utilizan.'],
      },
      {
        title: 'Cómo usamos las cookies',
        body: ['Describe cookies esenciales, analíticas y de marketing.'],
        bullets: ['Cookies esenciales', 'Cookies analíticas', 'Cookies de marketing'],
      },
      {
        title: 'Gestionar preferencias',
        body: ['Explica cómo controlar las preferencias de cookies.'],
      },
    ],
    contact: {
      label: 'Contacto de cookies',
      emailLabel: 'Email',
      addressLabel: 'Dirección',
    },
    footerNote: 'Sustituye este contenido por tu política de cookies oficial.',
    backToLegalLabel: 'Volver a legal',
  },
};
