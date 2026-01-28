import type { CookiesMessages } from '../types/cookies';

export const cookies: CookiesMessages = {
  banner: {
    title: 'Utilitzem cookies',
    description:
      'Fem servir cookies essencials perquè aquest lloc funcioni. Amb el teu permís, també usem cookies d’analítica i de màrqueting per millorar l’experiència.',
    acceptAll: 'Acceptar-ho tot',
    rejectAll: 'Rebutjar no essencials',
    manage: 'Configurar',
    policyLinkLabel: 'Política de cookies',
  },
  dialog: {
    title: 'Preferències de cookies',
    description:
      'Tria quins tipus de cookies permets. Pots canviar aquests ajustos en qualsevol moment des de la pàgina de política de cookies.',
    acceptAll: 'Acceptar-ho tot',
    rejectAll: 'Rebutjar no essencials',
    savePreferences: 'Desar preferències',
    policyLinkLabel: 'Política de cookies',
    categories: {
      necessary: {
        title: 'Cookies essencials',
        description: 'Són necessàries per al funcionament del lloc i no es poden desactivar.',
        lockedLabel: 'Sempre actives',
      },
      analytics: {
        title: 'Cookies d’analítica',
        description: 'Ens ajuden a entendre l’ús del lloc per millorar el rendiment.',
        lockedLabel: 'Opcional',
      },
      marketing: {
        title: 'Cookies de màrqueting',
        description: 'S’utilitzen per oferir contingut rellevant i mesurar campanyes.',
        lockedLabel: 'Opcional',
      },
    },
  },
};
