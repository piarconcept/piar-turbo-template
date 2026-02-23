import type { DashboardMessages } from '../types/dashboard';

export const dashboard: DashboardMessages = {
  title: 'Panel',
  subtitle: 'Resumen del área de administración.',
  recentActivity: 'Actividad reciente',
  profile: {
    title: 'Perfil',
    viewProfile: 'Consulta tu perfil y la sesión activa.',
    email: 'Email',
    userId: 'ID de usuario',
    role: 'Rol',
    logout: 'Cerrar sesión',
  },
  nav: {
    accounts: 'Cuentas',
    contactSubmissions: 'Contactos',
    dashboard: 'Panel',
    dynamicPages: 'Páginas dinámicas',
    modules: 'Módulos',
  },
  stats: {
    users: 'Usuarios',
    content: 'Contenido',
    views: 'Vistas',
    conversion: 'Conversión',
  },
  search: {
    resultsFor: 'Resultados para',
    resultsLabel: 'resultados',
    prompt: 'Busca cuentas por código, email o rol.',
    noResultsFor: 'No se han encontrado resultados para',
    adjustHint: 'Prueba con otro término de búsqueda.',
    emptyTitle: 'Empieza a buscar',
    emptyDescription: 'Usa la barra de búsqueda para encontrar cuentas en tu backoffice.',
    loading: 'Cargando búsqueda...',
  },
};
