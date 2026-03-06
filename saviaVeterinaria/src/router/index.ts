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
    }
  ]
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