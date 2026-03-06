import { createRouter, createWebHistory } from 'vue-router';

// Configuración del router con todas las rutas de la aplicación
const router = createRouter({
  history: createWebHistory(), // Usa el historial del navegador (sin #)
  routes: [
    {
      // Rutas públicas con layout principal (header + footer)
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('../views/HomeView.vue') },
        { path: 'pets', name: 'pets', component: () => import('../views/PetsView.vue') },
        { path: 'pet/:id', name: 'petDetail', component: () => import('../views/PetDetailView.vue') },
        { path: 'users', name: 'users', component: () => import('../views/UsersView.vue') },
      ]
    },
    {
      // Rutas de autenticación (login y registro) con layout sin header/footer
      path: '/auth',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        { path: 'login', name: 'login', component: () => import('../views/LoginView.vue') },
        { path: 'register', name: 'register', component: () => import('../views/RegisterView.vue') }
      ]
    },
    {
      // Ruta del panel de administración
      path: '/admin',
      name: 'admin',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        { path : '', name: 'adminHome', component: () => import('../views/AdminView.vue') }
      ]
      // TODO: Aquí se puede añadir un guard para proteger la ruta
      // y que solo los administradores puedan acceder
    }
  ]
});

export default router;