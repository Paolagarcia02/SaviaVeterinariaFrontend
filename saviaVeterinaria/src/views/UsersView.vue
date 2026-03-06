<script setup lang="ts">
/**
 * Vista de Usuarios
 * Muestra un listado de todos los usuarios registrados
 * Solo accesible para administradores
 */
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import type { User } from '@/models/type';

const authStore = useAuthStore();
const router = useRouter();

// Lista de usuarios
const users = ref<User[]>([]);

// Estado de carga
const loading = ref(true);

// Filtros de búsqueda
const searchQuery = ref('');
const selectedRole = ref('all');

// Al montar el componente, verificamos permisos y cargamos usuarios
onMounted(async () => {
    // Si no es admin, redirigimos a la página principal
    if (!authStore.isAdmin) {
        router.push('/');
        return;
    }
    await loadUsers();
});

// Función para cargar la lista de usuarios desde el backend
const loadUsers = async () => {
    try {
        const response = await api.get('/User');
        users.value = response.data;
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    } finally {
        loading.value = false;
    }
};

// Computed: filtra los usuarios según rol y texto de búsqueda
const filteredUsers = computed(() => {
    let result = users.value;

    // Filtrar por rol si no es "all"
    if (selectedRole.value !== 'all') {
        result = result.filter(user => user.role === selectedRole.value);
    }

    // Filtrar por texto de búsqueda (nombre o email)
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(user => 
            user.full_name.toLowerCase().includes(query) || 
            user.email.toLowerCase().includes(query)
        );
    }

    return result;
});
</script>

<template>
    <main class="users-page">
        <section class="users-hero">
            <h1 class="users-hero__title">Gestión de Usuarios</h1>
            <p class="users-hero__subtitle">Administra los usuarios del sistema</p>
        </section>

        <section class="users-filters">
            <div class="container">
                <div class="filters-wrapper">
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        class="search-input" 
                        placeholder="Buscar por nombre o email..."
                    >
                    
                    <select v-model="selectedRole" class="role-select">
                        <option value="all">Todos los roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Vet">Veterinario</option>
                        <option value="User">Usuario</option>
                    </select>
                </div>
            </div>
        </section>

        <section class="users-list">
            <div class="container">
                <div v-if="loading" class="loading">Cargando usuarios...</div>
                
                <div v-else-if="filteredUsers.length === 0" class="no-results">
                    No se encontraron usuarios con esos criterios
                </div>
                
                <div v-else class="table-wrapper">
                    <table class="users-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Fecha de Registro</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in filteredUsers" :key="user.user_id">
                                <td>{{ user.user_id }}</td>
                                <td><strong>{{ user.full_name }}</strong></td>
                                <td>{{ user.email }}</td>
                                <td>
                                    <span :class="['role-badge', user.role.toLowerCase()]">
                                        {{ user.role }}
                                    </span>
                                </td>
                                <td>{{ new Date(user.created_at).toLocaleDateString('es-ES') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.users-page {
    background: v.$color-green-light;
    min-height: 100vh;
}

.users-hero {
    padding: 60px 20px;
    text-align: center;
    background: linear-gradient(135deg, v.$color-green-dark 0%, v.$color-green-medium 100%);
    color: white;

    &__title {
        font-family: v.$font-title;
        font-size: 3rem;
        margin-bottom: 15px;
    }

    &__subtitle {
        font-family: v.$font-subtitle;
        font-size: 1.3rem;
        opacity: 0.9;
    }
}

.users-filters {
    padding: 40px 20px;
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.filters-wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 800px;
    margin: 0 auto;

    @media (min-width: 768px) {
        flex-direction: row;
    }
}

.search-input, .role-select {
    padding: 12px 20px;
    border: 2px solid v.$color-green-medium;
    border-radius: 8px;
    font-family: v.$font-subtitle;
    font-size: 1rem;
    outline: none;

    &:focus {
        border-color: v.$color-peach-dark;
    }
}

.search-input {
    flex: 2;
}

.role-select {
    flex: 1;
    cursor: pointer;
}

.users-list {
    padding: 60px 20px;
}

.table-wrapper {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.users-table {
    width: 100%;
    border-collapse: collapse;

    thead {
        background: v.$color-green-dark;
        color: white;

        th {
            padding: 16px;
            text-align: left;
            font-family: v.$font-title;
            font-weight: bold;
        }
    }

    tbody {
        tr {
            border-bottom: 1px solid #f0f0f0;
            transition: background 0.2s;

            &:hover {
                background: v.$color-green-light;
            }
        }

        td {
            padding: 16px;
            font-family: v.$font-subtitle;
            color: #333;
        }
    }
}

.role-badge {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: bold;
    text-transform: uppercase;

    &.admin { background-color: #fce4ec; color: #d81b60; }
    &.vet { background-color: #e8eaf6; color: #3f51b5; }
    &.user { background-color: #eeeeee; color: #616161; }
}

.loading, .no-results {
    text-align: center;
    font-family: v.$font-subtitle;
    font-size: 1.2rem;
    color: v.$color-green-dark;
    padding: 60px 20px;
}
</style>
