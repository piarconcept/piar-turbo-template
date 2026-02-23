import type { DashboardMessages } from '../types/dashboard';

export const dashboard: DashboardMessages = {
  title: 'Tauler',
  subtitle: "Resum de l'àrea d'administració.",
  recentActivity: 'Activitat recent',
  profile: {
    title: 'Perfil',
    viewProfile: 'Consulta el teu perfil i la sessió activa.',
    email: 'Email',
    userId: "ID d'usuari",
    role: 'Rol',
    logout: 'Tancar sessió',
  },
  nav: {
    accounts: 'Comptes',
    contactSubmissions: 'Contactes',
    dashboard: 'Tauler',
    dynamicPages: 'Pàgines dinàmiques',
    modules: 'Mòduls',
  },
  stats: {
    users: 'Usuaris',
    content: 'Contingut',
    views: 'Vistes',
    conversion: 'Conversió',
  },
  search: {
    resultsFor: 'Resultats per',
    resultsLabel: 'resultats',
    prompt: 'Cerca comptes per codi, correu o rol.',
    noResultsFor: 'No s’han trobat resultats per',
    adjustHint: 'Prova un altre terme de cerca.',
    emptyTitle: 'Comença a cercar',
    emptyDescription: 'Fes servir la barra de cerca per trobar comptes al teu backoffice.',
    loading: 'Carregant cerca...',
  },
};
