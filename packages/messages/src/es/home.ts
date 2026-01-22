import type { HomeMessages } from '../types/home';

export const home: HomeMessages = {
  title: 'Centro de control del backoffice',
  subtitle: 'Gestiona usuarios, permisos e informes desde un lugar seguro.',
  signIn: 'Iniciar sesión',
  requestAccess: 'Solicitar acceso',
  features: {
    title: 'Todo lo que necesitas para operar',
    users: {
      title: 'Gestión de usuarios',
      description: 'Invita, incorpora y controla roles con total visibilidad.',
    },
    analytics: {
      title: 'Analítica de rendimiento',
      description: 'Sigue la actividad y los resultados con paneles claros.',
    },
    settings: {
      title: 'Ajustes de la organización',
      description: 'Configura accesos, seguridad e integraciones en minutos.',
    },
  },
  cta: {
    title: '¿Listo para solicitar acceso?',
    description: 'Crea tu cuenta y la revisaremos rápidamente.',
    button: 'Empezar solicitud',
  },
};
