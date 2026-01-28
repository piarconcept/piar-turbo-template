import type { CookiesMessages } from '../types/cookies';

export const cookies: CookiesMessages = {
  banner: {
    title: 'Usamos cookies',
    description:
      'Usamos cookies esenciales para que este sitio funcione. Con tu permiso, también usamos cookies de analítica y marketing para mejorar la experiencia.',
    acceptAll: 'Aceptar todas',
    rejectAll: 'Rechazar no esenciales',
    manage: 'Configurar',
    policyLinkLabel: 'Política de cookies',
  },
  dialog: {
    title: 'Preferencias de cookies',
    description:
      'Elige qué tipos de cookies permites. Puedes cambiar estos ajustes en cualquier momento desde la página de política de cookies.',
    acceptAll: 'Aceptar todas',
    rejectAll: 'Rechazar no esenciales',
    savePreferences: 'Guardar preferencias',
    policyLinkLabel: 'Política de cookies',
    categories: {
      necessary: {
        title: 'Cookies esenciales',
        description: 'Necesarias para el funcionamiento del sitio y no se pueden desactivar.',
        lockedLabel: 'Siempre activas',
      },
      analytics: {
        title: 'Cookies de analítica',
        description: 'Nos ayudan a entender el uso del sitio para mejorar el rendimiento.',
        lockedLabel: 'Opcionales',
      },
      marketing: {
        title: 'Cookies de marketing',
        description: 'Se usan para ofrecer contenido relevante y medir campañas.',
        lockedLabel: 'Opcionales',
      },
    },
  },
};
