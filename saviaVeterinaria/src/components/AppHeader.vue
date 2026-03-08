<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

const handleLogout = () => {
    authStore.logout();
    router.push({ name: 'home' });
};
</script>

<template>
    <header class="header">
        <div class="container header__container">
            <div class="header__menu-wrapper">
                <button class="header__toggle" @click="toggleMenu" aria-label="Toggle navigation menu">
                    <span class="header__icon">☰</span>
                </button>

                <nav class="header__nav" :class="{ 'header__nav--open': isMenuOpen }">
                    <router-link to="/" class="header__nav-link" @click="closeMenu">Inicio</router-link>
                    <router-link to="/pets" class="header__nav-link" @click="closeMenu">Mascotas</router-link>
                    <router-link to="/services" class="header__nav-link" @click="closeMenu">Servicios</router-link>
                    <router-link to="/contact" class="header__nav-link" @click="closeMenu">Contacto</router-link>
                    <router-link v-if="authStore.isLogged && !authStore.canAccessAdmin" to="/users" class="header__nav-link" @click="closeMenu">Mi Panel</router-link>
                    <router-link v-if="authStore.canAccessAdmin" to="/admin" class="header__nav-link header__nav-link--admin" @click="closeMenu">
                        Panel Admin
                    </router-link>
                </nav>
            </div>

            <router-link to="/" class="header__logo-link">
                <span class="header__brand-name">SAVIA</span>
                <img src="@/assets/images/home/logoHomeSinFondo.png" class="header__logo-img" alt="Logo SAVIA">
            </router-link>

            <div class="header__actions">
                <router-link v-if="!authStore.isLogged" to="/auth/login" class="header__user-btn" title="Iniciar Sesión">
                    <img src="@/assets/images/home/logoUsuarioBlanco.png" class="header__user-icon" alt="Login">
                    <span class="header__user-text">Entrar</span>
                </router-link>

                <button v-else @click="handleLogout" class="header__user-btn" title="Cerrar Sesión">
                    <img src="@/assets/images/home/logoUsuarioBlanco.png" class="header__user-icon" alt="Logout">
                    <span class="header__user-text">Salir</span>
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.header {
    background-color: v.$color-green-dark;
    padding: 15px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &__container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        gap: 20px;
    }

    &__menu-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        position: relative;
    }

    &__toggle {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        color: v.$color-white;
        font-size: 24px;
        display: flex;
        align-items: center;
        transition: transform 0.3s;

        &:hover {
            transform: scale(1.1);
        }
    }

    &__nav {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: v.$color-green-dark;
        width: 250px;
        padding: 10px 0;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
        border-radius: 0 0 8px 8px;
        z-index: 1000;

        &--open {
            display: flex !important;
        }
    }

    &__nav-link {
        color: v.$color-white;
        text-decoration: none;
        padding: 12px 20px;
        font-family: v.$font-subtitle;
        font-weight: v.$weight-medium;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 8px;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: v.$color-peach-medium;
        }

        &--admin {
            color: v.$color-white;
            font-weight: v.$weight-bold;
        }

        @media (min-width: 768px) {
            padding: 8px 12px;
            border-radius: 4px;
        }
    }

    &__logo-link {
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
        height: 50px;
        width: auto;

        @media (min-width: 768px) {
            height: 60px;
        }
    }

    &__actions {
        flex: 1;
        display: flex;
        justify-content: flex-end;
    }

    &__user-btn {
        background: none;
        border: 2px solid v.$color-peach-medium;
        cursor: pointer;
        padding: 8px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        color: v.$color-white;
        text-decoration: none;
        border-radius: 20px;
        transition: all 0.3s;
        font-family: v.$font-subtitle;
        font-weight: v.$weight-medium;

        &:hover {
            background-color: v.$color-peach-medium;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
    }

    &__user-icon {
        height: 24px;
        width: 24px;
        display: block;
    }

    &__user-text {
        display: none;

        @media (min-width: 480px) {
            display: inline;
        }
    }
}
</style>
