import type { LegalMessages } from '../types/legal';

export const legal: LegalMessages = {
  index: {
    title: 'Legal',
    description: 'Documents legals essencials d’aquest producte.',
    privacyLabel: 'Política de privadesa',
    privacyDescription: 'Com gestionem les dades personals.',
    termsLabel: 'Termes del servei',
    termsDescription: 'Normes d’ús i responsabilitats.',
    cookiesLabel: 'Política de cookies',
    cookiesDescription: 'Detalls sobre cookies i seguiment.',
  },
  privacy: {
    title: 'Política de privadesa',
    intro: 'Aquest és un text d’exemple. Substitueix-lo per la política oficial.',
    updatedAt: 'Darrera actualització: 27 de gener de 2026',
    sections: [
      {
        title: 'Informació que recollim',
        body: ['Descriu les categories de dades personals recollides i el seu ús.'],
        bullets: ['Informació de contacte', 'Dades de compte', 'Analítica d’ús'],
      },
      {
        title: 'Com utilitzem la informació',
        body: ['Explica la base legal i les finalitats del tractament.'],
      },
      {
        title: 'Els teus drets',
        body: ['Indica com accedir, actualitzar o eliminar les teves dades.'],
      },
    ],
    contact: {
      label: 'Contacte de privadesa',
      emailLabel: 'Email',
      addressLabel: 'Adreça',
    },
    footerNote: 'Substitueix aquest contingut per la política oficial de privadesa.',
    backToLegalLabel: 'Tornar a legal',
  },
  terms: {
    title: 'Termes del servei',
    intro: 'Aquest és un text d’exemple. Substitueix-lo pels termes oficials.',
    updatedAt: 'Darrera actualització: 27 de gener de 2026',
    sections: [
      {
        title: 'Normes d’ús',
        body: ['Resumeix l’ús permès i els comportaments prohibits.'],
      },
      {
        title: 'Comptes i seguretat',
        body: ['Defineix responsabilitats sobre credencials i accés.'],
      },
      {
        title: 'Responsabilitat',
        body: ['Aclareix limitacions de responsabilitat i exencions.'],
      },
    ],
    contact: {
      label: 'Contacte de termes',
      emailLabel: 'Email',
      addressLabel: 'Adreça',
    },
    footerNote: 'Substitueix aquest contingut pels termes oficials.',
    backToLegalLabel: 'Tornar a legal',
  },
  cookies: {
    title: 'Política de cookies',
    intro: 'Aquest és un text d’exemple. Substitueix-lo per la política oficial.',
    updatedAt: 'Darrera actualització: 27 de gener de 2026',
    sections: [
      {
        title: 'Què són les cookies?',
        body: ['Explica què són les cookies i com s’utilitzen.'],
      },
      {
        title: 'Com utilitzem les cookies',
        body: ['Descriu cookies essencials, analítiques i de màrqueting.'],
        bullets: ['Cookies essencials', 'Cookies analítiques', 'Cookies de màrqueting'],
      },
      {
        title: 'Gestionar preferències',
        body: ['Explica com controlar les preferències de cookies.'],
      },
    ],
    contact: {
      label: 'Contacte de cookies',
      emailLabel: 'Email',
      addressLabel: 'Adreça',
    },
    footerNote: 'Substitueix aquest contingut per la política oficial de cookies.',
    backToLegalLabel: 'Tornar a legal',
  },
};
