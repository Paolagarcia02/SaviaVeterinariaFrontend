<script setup lang="ts">
/**
 * Vista de Login
 * Permite a los usuarios iniciar sesión en la aplicación
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';
import { useAuthStore } from '../stores/authStore';
import Swal from 'sweetalert2';

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();
const errorMessage = ref('');

// Función que maneja el envío del formulario de login
const handleLogin = async () => {
    errorMessage.value = '';
    try {
        // Enviamos las credenciales al backend
        const response = await api.post('/Auth/login', {
            email: email.value,
            password: password.value
        });

        console.log("¿Qué hay dentro de response.data?:", response.data);

        // Guardamos el token y el rol en el store y localStorage
        authStore.login(response.data.token, response.data.role);
        
        // Mostramos mensaje de éxito
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Bienvenido de nuevo",
            showConfirmButton: false,
            timer: 1500
        });

        router.push({ name: 'home' });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error de acceso",
            text: "Usuario o contraseña incorrectos",
        });
    }
};
</script>

<template>
    <main class="main-content login-page">
        <div class="container login-wrapper">
            <div class="login-card">
                <div class="login-header">
                    <h1 class="login-title">Bienvenido</h1>
                    <p class="login-subtitle">Accede a tu área personal</p>
                </div>

                <form class="login-form" @submit.prevent="handleLogin">
                    <div class="form-group">
                        <label for="email" class="form-label">Correo Electrónico</label>
                        <input v-model="email" type="email" id="email" class="form-input"
                            placeholder="ejemplo@correo.com" required>
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label">Contraseña</label>
                        <input v-model="password" type="password" id="password" class="form-input"
                            placeholder="••••••••" required>
                    </div>

                    <button type="submit" class="btn btn--primary btn--full">Entrar</button>

                    <div class="login-footer">
                        <a href="#" class="login-link">¿Olvidaste tu contraseña?</a>
                        <p>¿Aún no tienes cuenta?
                            <router-link to="/auth/register" class="login-link login-link--bold">Regístrate
                                aquí</router-link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100vw;
    padding: 0;
    margin: 0;
    background-color: v.$color-green-light;
}

.login-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 0;
}

// 2. Estilo "CARD"
.login-card {
    background-color: v.$color-peach-ligth;
    border-radius: 16px;
    padding: 40px 30px;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 4px 15px rgba(v.$color-green-dark, 0.05);

    animation: fadeInUp 0.5s ease-out;
}

// Estilos de texto
.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.login-title {
    font-family: v.$font-title;
    color: v.$color-green-dark;
    font-size: 2.5rem;
    text-transform: uppercase;
    margin-bottom: 5px;
}

.login-subtitle {
    font-family: v.$font-subtitle;
    color: v.$color-green-dark;
    font-size: 1.1rem;
    opacity: 0.8;
}


.btn--full {
    width: 100%;
    display: block;
    text-align: center;
    margin-top: 20px;
    border: none;
    cursor: pointer;

    background-color: v.$color-peach-dark;
    color: v.$color-white;
}


.login-footer {
    margin-top: 25px;
    text-align: center;
    font-family: v.$font-subtitle;
    font-size: 0.9rem;
    color: v.$color-green-dark;

    p {
        margin-top: 10px;
    }
}

.login-link {
    color: v.$color-green-dark;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
        color: v.$color-peach-dark;
        text-decoration: underline;
    }
}

.login-link--bold {
    font-weight: v.$weight-bold;
}

.form-group {
    margin-bottom: 20px;
    text-align: left;
}

.form-label {
    display: block;
    font-family: v.$font-title;
    color: v.$color-green-dark;
    margin-bottom: 8px;
    font-weight: v.$weight-bold;
}

.form-input {
    width: 100%;
    padding: 12px 15px;
    border-radius: 8px;
    border: 2px solid v.$color-green-medium;
    background-color: rgba(255, 255, 255, 0.3);
    font-family: v.$font-subtitle;
    color: v.$color-green-dark;
    font-size: 1rem;
    outline: none;
    box-sizing: border-box;

    &:focus {
        border-color: v.$color-peach-dark;
        background-color: rgba(255, 255, 255, 0.5);
    }
}

.btn--full {
    width: 100%;
    display: block;
    text-align: center;
    margin-top: 20px;
    border: none;
    cursor: pointer;
    background-color: v.$color-peach-dark;
    color: v.$color-white;
    padding: 15px;
    border-radius: 8px;
    font-family: v.$font-title;
    font-weight: bold;
    font-size: 1.2rem;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
