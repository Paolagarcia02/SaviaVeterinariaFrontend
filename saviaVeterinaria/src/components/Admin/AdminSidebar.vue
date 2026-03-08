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
                    @click="emit('changeTab', 'profile')" 
                    :class="['nav-item', { 'active': activeTab === 'profile' }]"
                >
                    <span class="nav-icon">👤</span>
                    <span class="nav-text">Mi Perfil</span>
                </button>

                <button 
                    @click="emit('changeTab', 'pets')" 
                    :class="['nav-item', { 'active': activeTab === 'pets' }]"
                >
                    <span class="nav-icon">🐾</span>
                    <span class="nav-text">Mis Mascotas</span>
                </button>

                <button 
                    @click="emit('changeTab', 'appointments')" 
                    :class="['nav-item', { 'active': activeTab === 'appointments' }]"
                >
                    <span class="nav-icon">📅</span>
                    <span class="nav-text">Mis Citas</span>
                </button>

                <button 
                    @click="emit('changeTab', 'applications')" 
                    :class="['nav-item', { 'active': activeTab === 'applications' }]"
                >
                    <span class="nav-icon">📝</span>
                    <span class="nav-text">Solicitudes</span>
                </button>
            </template>

            <template v-else>
                <button 
                    @click="emit('changeTab', 'profile')" 
                    :class="['nav-item', { 'active': activeTab === 'profile' }]"
                >
                    <span class="nav-icon">👤</span>
                    <span class="nav-text">Mi Perfil</span>
                </button>

                <button 
                    @click="emit('changeTab', 'franchises')" 
                    :class="['nav-item', { 'active': activeTab === 'franchises' }]"
                >
                    <span class="nav-icon">🏢</span>
                    <span class="nav-text">Franquicias</span>
                </button>

                <button 
                    @click="emit('changeTab', 'services')" 
                    :class="['nav-item', { 'active': activeTab === 'services' }]"
                >
                    <span class="nav-icon">🩺</span>
                    <span class="nav-text">Servicios</span>
                </button>

                <button 
                    @click="emit('changeTab', 'clinicRooms')" 
                    :class="['nav-item', { 'active': activeTab === 'clinicRooms' }]"
                >
                    <span class="nav-icon">🏥</span>
                    <span class="nav-text">Clinic Rooms</span>
                </button>

                <button
                    @click="emit('changeTab', 'clinicSchedules')"
                    :class="['nav-item', { 'active': activeTab === 'clinicSchedules' }]"
                >
                    <span class="nav-icon">🕒</span>
                    <span class="nav-text">Horarios</span>
                </button>

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

                <button 
                    @click="emit('changeTab', 'appointments')" 
                    :class="['nav-item', { 'active': activeTab === 'appointments' }]"
                >
                    <span class="nav-icon">📅</span>
                    <span class="nav-text">Citas</span>
                </button>

                <button 
                    @click="emit('changeTab', 'labTests')" 
                    :class="['nav-item', { 'active': activeTab === 'labTests' }]"
                >
                    <span class="nav-icon">🧪</span>
                    <span class="nav-text">Lab Tests</span>
                </button>

                <button 
                    @click="emit('changeTab', 'adoptionApplications')" 
                    :class="['nav-item', { 'active': activeTab === 'adoptionApplications' }]"
                >
                    <span class="nav-icon">📝</span>
                    <span class="nav-text">Adopciones</span>
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
    overflow: hidden;
}

.sidebar-header {
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .sidebar-title {
        font-family: v.$font-title;
        font-size: 1.4rem;
        color: v.$color-white;
        margin: 0;
        text-align: center;
    }
}

.sidebar-nav {
    flex: 1;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
}

.nav-item {
    width: 100%;
    padding: 18px 25px;
    display: flex;
    align-items: center;
    gap: 15px;
    background: none;
    border: none;
    color: v.$color-white;
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
        color: v.$color-white;
        border-left: 5px solid v.$color-white;
    }
}

.sidebar-divider {
    height: 1px;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 20px 25px;
}
</style>
