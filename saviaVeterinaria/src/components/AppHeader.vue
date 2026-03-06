<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

// Obtenemos el store de autenticación para verificar si el usuario está logueado
const authStore = useAuthStore();
// Estado para controlar si el menú móvil está abierto o cerrado
const isMenuOpen = ref(false);

// Función para alternar la visibilidad del menú
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

// Función para cerrar el menú
const closeMenu = () => {
    isMenuOpen.value = false;
};
</script>

<template>
    <header class="header">
        <div class="container header__container">
            <button class="header__toggle" @click="toggleMenu" aria-label="Toggle navigation menu">
                <span class="header__icon">☰</span>
            </button>

            <router-link to="/" class="header__logo-link">
                <span class="header__brand-name">SAVIA</span>
                <img src="@/assets/images/home/logoHomeSinFondo.png" class="header__logo-img">
            </router-link>

            <div class="header__actions">

                <router-link v-if="authStore.isAdmin" to="/admin" class="header__admin-link">
                    <img src="@/assets/images/home/admin.png" class="header__user-icon icon-white" alt="Admin">
                </router-link>

                <router-link v-if="!authStore.isLogged" to="/auth/login" class="header__user-link"
                    title="Iniciar Sesión">
                    <img src="@/assets/images/home/logoUsuarioBlanco.png" class="header__user-icon">
                </router-link>

                <button v-else @click="authStore.logout" class="header__logout-btn" title="Cerrar Sesión">
                    <span class="logout-icon">✕</span>
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.header {
    background-color: v.$color-green-dark;
    padding: 20px 0;
    position: sticky;
    top: 0;
    z-index: 100;

    &__container {
        display: flex;
        align-items: center;
        justify-content: space-between; // Para separar los elementos
        padding: 0 20px;
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: 15px; // Espacio entre el icono de admin y el de usuario
        margin-top: 30px;
    }

    &__toggle,
    &__user-link,
    &__admin-link,
    &__logout-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: v.$color-white;
        text-decoration: none;

        img {
            height: 28px;
            width: 28px;
            display: block;
        }
    }

    &__logout-btn {
        font-size: 20px;
        font-weight: bold;
        color: v.$color-peach-medium;

        &:hover {
            color: v.$color-white;
        }
    }

    &__logo-link {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        justify-content: center;
    }

    &__brand-name {
        font-family: v.$font-title;
        color: v.$color-peach-medium;
        font-weight: bold;
        font-size: 1.4rem;
        letter-spacing: 0.1em;
        margin-bottom: 5px;
        line-height: 1;
    }

    &__logo-img {
        height: 60px;
        width: auto;
    }

    .icon-white {
        filter: invert(100%) brightness(200%);

        &:hover {
            filter: invert(100%) brightness(200%) drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
        }
    }
}
</style>