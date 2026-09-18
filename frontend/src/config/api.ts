export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/v1/auth/login',
    registerCitoyen: '/api/v1/auth/inscription/citoyen',
    registerRecycleur: '/api/v1/auth/inscription/recycleur',
  },
  signalements: {
    create: '/api/v1/signalements',
    list: '/api/v1/signalements',
    myReports: '/api/v1/signalements/mes-signalements',
    validate: (id: string) => `/api/v1/signalements/${id}/valider`,
  },
  zones: {
    list: '/api/v1/zones',
    priority: '/api/v1/zones/prioritaires',
  },
  appelsOffres: {
    create: '/api/v1/appels-offres',
    list: '/api/v1/appels-offres',
    participate: (id: string) => `/api/v1/appels-offres/${id}/participer`,
  },
  operations: {
    create: '/api/v1/operations',
    list: '/api/v1/operations',
    close: (id: string) => `/api/v1/operations/${id}/cloturer`,
    addDechets: (id: string) => `/api/v1/operations/${id}/dechets`,
  },
  ecoshop: {
    lots: '/api/v1/ecoshop/lots',
    createLot: '/api/v1/ecoshop/lots',
    commandes: '/api/v1/ecoshop/commandes',
    createCommande: '/api/v1/ecoshop/commandes',
  },
  dashboard: {
    ecomer: '/api/v1/dashboard/ecomer',
    citoyen: '/api/v1/dashboard/citoyen',
  },
  upload: '/api/v1/upload',
} as const;
