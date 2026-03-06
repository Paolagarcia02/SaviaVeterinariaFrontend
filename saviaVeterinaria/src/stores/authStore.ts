import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Store para manejar la autenticación del usuario
export const useAuthStore = defineStore('auth', () => {
    // Estado: token y rol del usuario (se guardan en localStorage)
    const token = ref(localStorage.getItem('token') || '');
    const userRole = ref(localStorage.getItem('userRole') || ''); 

    // Getters: propiedades calculadas
    const isLogged = computed(() => !!token.value); // true si hay token
    const isAdmin = computed(() => userRole.value === 'Admin'); // true si es admin

    // Action: guardar datos de login
    function login(newToken: string, role: string) {
        token.value = newToken;
        userRole.value = role;
        localStorage.setItem('token', newToken);
        localStorage.setItem('userRole', role);
    }

    // Action: cerrar sesión
    function logout() {
        token.value = '';
        userRole.value = '';
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
    }

    return { token, userRole, isLogged, isAdmin, login, logout };
});