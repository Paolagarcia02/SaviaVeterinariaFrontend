import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('../views/HomeView.vue') },
        { path: 'pets', name: 'pets', component: () => import('../views/PetsView.vue') },
        { path: 'pet/:id', name: 'petDetail', component: () => import('../views/PetDetailView.vue') },
        { path: 'services', name: 'services', component: () => import('../views/ServicesView.vue') },
        { path: 'contact', name: 'contact', component: () => import('../views/ContactView.vue') },
        { path: 'appointment', name: 'appointment', component: () => import('../views/AppointmentView.vue') },
        { path: 'adoption', name: 'adoption', component: () => import('../views/AdoptionView.vue') },
        { path: 'legal/aviso-legal', name: 'legalNotice', component: () => import('../views/LegalNoticeView.vue') },
        { path: 'legal/privacidad', name: 'privacyPolicy', component: () => import('../views/PrivacyPolicyView.vue') },
        { path: 'legal/cookies', name: 'cookiesPolicy', component: () => import('../views/CookiesPolicyView.vue') },
      ]
    },
    {
      path: '/auth',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        { path: 'login', name: 'login', component: () => import('../views/LoginView.vue') },
        { path: 'register', name: 'register', component: () => import('../views/RegisterView.vue') }
      ]
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../layouts/AuthLayout.vue'),
      meta: { requiresAdmin: true },
      children: [
        { path : '', name: 'adminHome', component: () => import('../views/AdminView.vue') }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
});

const routeTitleByName: Partial<Record<string, string>> = {
  home: 'Inicio',
  pets: 'Mascotas',
  petDetail: 'Detalle de Mascota',
  services: 'Servicios',
  contact: 'Contacto',
  appointment: 'Citas',
  adoption: 'Adopción',
  legalNotice: 'Aviso Legal',
  privacyPolicy: 'Privacidad',
  cookiesPolicy: 'Cookies',
  login: 'Iniciar Sesión',
  register: 'Registro',
  users: 'Mi Panel',
  admin: 'Panel Admin',
  adminHome: 'Panel Admin',
  notFound: 'Página no encontrada'
};

router.afterEach((to) => {
  const key = typeof to.name === 'string' ? to.name : '';
  const sectionTitle = routeTitleByName[key] || 'Savia Veterinaria';
  document.title = `${sectionTitle} | Savia Veterinaria`;
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAdmin && !authStore.canAccessAdmin) {
    next({ name: 'login' });
  } else if (to.meta.requiresAuth && !authStore.isLogged) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
