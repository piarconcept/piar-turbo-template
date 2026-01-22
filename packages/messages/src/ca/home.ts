import type { HomeMessages } from '../types/home';

export const home: HomeMessages = {
  title: 'Centre de control del backoffice',
  subtitle: "Gestiona usuaris, permisos i informes des d'un entorn segur.",
  signIn: 'Iniciar sessió',
  requestAccess: 'Demanar accés',
  features: {
    title: 'Tot el que necessites per operar',
    users: {
      title: "Gestió d'usuaris",
      description: 'Convida, incorpora i controla rols amb plena visibilitat.',
    },
    analytics: {
      title: 'Analítica de rendiment',
      description: "Segueix l'activitat i els resultats amb panells clars.",
    },
    settings: {
      title: "Configuració de l'organització",
      description: 'Configura accessos, seguretat i integracions en minuts.',
    },
  },
  cta: {
    title: 'A punt per demanar accés?',
    description: 'Crea el teu compte i el revisarem ràpidament.',
    button: 'Començar sol·licitud',
  },
};
