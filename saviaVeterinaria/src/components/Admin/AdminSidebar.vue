<script setup lang="ts">
defineProps<{
    activeTab: string;
    isUserPanel?: boolean;
}>();

const emit = defineEmits<{
    (e: 'changeTab', tab: string): void
}>();
</script>

<template>
    <aside class="admin-sidebar">
        <div class="sidebar-header">
            <div class="logo-wrapper">
                <img src="@/assets/images/home/logoHomeSinFondo.png" class="sidebar-logo" alt="Logo">
            </div>
            <h2 class="sidebar-title">{{ isUserPanel ? 'Mi Panel' : 'SAVIA Admin' }}</h2>
        </div>

        <nav class="sidebar-nav">
            <template v-if="isUserPanel">
                <button 
                    @click="emit('changeTab', 'dashboard')" 
                    :class="['nav-item', { 'active': activeTab === 'dashboard' }]"
                >
                    <span class="nav-icon">📊</span>
                    <span class="nav-text">Dashboard</span>
                </button>

                <button 
                    @click="emit('changeTab', 'pets')" 
                    :class="['nav-item', { 'active': activeTab === 'pets' }]"
                >
                    <span class="nav-icon">🐾</span>
                    <span class="nav-text">Mis Mascotas</span>
                </button>

                <button 
                    @click="emit('changeTab', 'applications')" 
                    :class="['nav-item', { 'active': activeTab === 'applications' }]"
                >
                    <span class="nav-icon">📝</span>
                    <span class="nav-text">Solicitudes</span>
                </button>

                <button 
                    @click="emit('changeTab', 'profile')" 
                    :class="['nav-item', { 'active': activeTab === 'profile' }]"
                >
                    <span class="nav-icon">👤</span>
                    <span class="nav-text">Mi Perfil</span>
                </button>
            </template>

            <template v-else>
                <button 
                    @click="emit('changeTab', 'pets')" 
                    :class="['nav-item', { 'active': activeTab === 'pets' }]"
                >
                    <span class="nav-icon">🐾</span>
                    <span class="nav-text">Mascotas</span>
                </button>

                <button 
                    @click="emit('changeTab', 'users')" 
                    :class="['nav-item', { 'active': activeTab === 'users' }]"
                >
                    <span class="nav-icon">👥</span>
                    <span class="nav-text">Usuarios</span>
                </button>
            </template>

            <div class="sidebar-divider"></div>

            <router-link to="/" class="nav-item back-link">
                <span class="nav-icon">🏠</span>
                <span class="nav-text">Volver a la Web</span>
            </router-link>
        </nav>
    </aside>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.admin-sidebar {
    width: 260px;
    min-width: 260px; // Para que no se encoja
    background-color: v.$color-green-dark;
    height: 100vh;
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    color: white;
}

.sidebar-header {
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px; // Espacio entre logo y texto
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .logo-wrapper {
        width: 80px; // Tamaño fijo para el contenedor
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sidebar-logo {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .sidebar-title {
        font-family: v.$font-title;
        font-size: 1.4rem;
        color: v.$color-peach-medium;
        margin: 0;
        text-align: center;
    }
}

.sidebar-nav {
    flex: 1;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
}

.nav-item {
    width: 100%;
    padding: 18px 25px;
    display: flex;
    align-items: center;
    gap: 15px;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    font-size: 1.1rem;

    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        color: white;
    }

    &.active {
        background-color: rgba(255, 255, 255, 0.1);
        color: v.$color-peach-medium;
        border-left: 5px solid v.$color-peach-medium;
    }
}

.sidebar-divider {
    height: 1px;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 20px 25px;
}
</style>