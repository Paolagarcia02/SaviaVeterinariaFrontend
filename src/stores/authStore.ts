import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(sessionStorage.getItem('token') || '');
    const userRole = ref(sessionStorage.getItem('userRole') || ''); 
    const userId = ref(parseInt(sessionStorage.getItem('userId') || '0', 10));
    const franchiseId = ref(parseInt(sessionStorage.getItem('FranchiseId') || '0', 10));

    const isLogged = computed(() => !!token.value);
    const isAdmin = computed(() => userRole.value === 'Admin');
    const isVet = computed(() => userRole.value === 'Vet');
    const canAccessAdmin = computed(() => isAdmin.value || isVet.value);

    function login(newToken: string, role: string, id?: number, newFranchiseId?: number) {
        token.value = newToken;
        userRole.value = role;
        userId.value = id || 0;
        franchiseId.value = newFranchiseId ?? 0;
        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('userRole', role);
        sessionStorage.setItem('userId', (id || 0).toString());
        sessionStorage.setItem('FranchiseId', (newFranchiseId || 0).toString());
    }

    function logout() {
        token.value = '';
        userRole.value = '';
        userId.value = 0;
        franchiseId.value = 0;
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('FranchiseId');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('FranchiseId');
    }

    return { token, userRole, userId, franchiseId, isLogged, isAdmin, isVet, canAccessAdmin, login, logout };
});
