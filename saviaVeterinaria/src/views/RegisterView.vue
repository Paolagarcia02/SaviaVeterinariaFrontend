<script setup lang="ts">
/**
 * Vista de Registro
 * Permite a nuevos usuarios crear una cuenta en la aplicación
 */
import api from '@/api/axios';
import router from '@/router';
import Swal from 'sweetalert2';
import { ref } from 'vue';

// Variables reactivas para el formulario de registro
const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const terms = ref(false); // Aceptación de términos y condiciones

// Función que maneja el envío del formulario de registro
const handleRegister = async () => {
    errorMessage.value = '';

    // Validamos que las contraseñas coincidan
    if (password.value !== confirmPassword.value) {
        errorMessage.value = "Las contraseñas no coinciden.";
        return;
    }

    try {
        // Enviamos los datos del nuevo usuario al backend
        await api.post('/Auth/register', {
            userName: fullName.value,
            email: email.value,
            password: password.value
        });

        await Swal.fire({
            title: "¡Registro completado!",
            text: "Ya puedes iniciar sesión con tu cuenta.",
            icon: "success",
            confirmButtonColor: "#f3a683",
        });

        router.push({ name: 'login' });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo ha fallado en el registro. ¿Quizás el email ya existe?",
            confirmButtonColor: "#2c3e50",
        });
    }
};
</script>

<template>
    <main class="main-content register-page">
        <div class="container register-wrapper">
            <div class="register-card">
                <header class="register-header">
                    <h1 class="register-title">Crear Cuenta</h1>
                    <p class="register-subtitle">Únete a la familia SAVIA</p>
                </header>

                <form class="register-form" @submit.prevent="handleRegister">
                    <div class="form-group">
                        <label for="fullName" class="form-label">Nombre y Apellidos</label>
                        <input v-model="fullName" type="text" id="fullName" class="form-input"
                            placeholder="Ej: Juan Pérez García" required>
                    </div>

                    <div class="form-group">
                        <label for="email" class="form-label">Correo Electrónico</label>
                        <input v-model="email" type="email" id="email" class="form-input"
                            placeholder="ejemplo@correo.com" required>
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label">Contraseña</label>
                        <input v-model="password" type="password" id="password" class="form-input"
                            placeholder="Mínimo 8 caracteres" required>
                    </div>

                    <div class="form-group">
                        <label for="confirm-password" class="form-label">Confirmar Contraseña</label>
                        <input v-model="confirmPassword" type="password" id="confirm-password" class="form-input"
                            placeholder="Repite la contraseña" required>
                    </div>

                    <div class="checkbox-group">
                        <input v-model="terms" type="checkbox" id="terms" required>
                        <label for="terms" class="terms-label">
                            Acepto la Política de Privacidad y Términos.
                        </label>
                    </div>

                    <button type="submit" class="btn btn--primary btn--full">Registrarme</button>
                </form>
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.register-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 85vh;
    padding: 30px 20px;
    background-color: v.$color-green-light;
}

.register-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
}

.register-card {
    background-color: v.$color-peach-ligth;
    border-radius: 16px;
    padding: 40px 30px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 4px 15px rgba(v.$color-green-dark, 0.05);
    border: 2px solid rgba(v.$color-white, 0.2);
    animation: fadeInUp 0.5s ease-out;
}

.register-header {
    text-align: center;
    margin-bottom: 30px;
}

.register-title {
    font-family: v.$font-title;
    color: v.$color-green-dark;
    font-size: 2.2rem;
    text-transform: uppercase;
    margin-bottom: 5px;
}

.register-subtitle {
    font-family: v.$font-subtitle;
    color: v.$color-green-dark;
    font-size: 1.1rem;
    opacity: 0.8;
}

.form-row {
    display: flex;
    flex-direction: column;
    gap: 0;

    @media (min-width: 600px) {
        flex-direction: row;
        gap: 20px;
    }

    >.form-group {
        flex: 1;
    }
}

/* Reutilizamos los estilos de input que definimos para el Login */
.form-group {
    margin-bottom: 20px;
    text-align: left;
}

.form-label {
    display: block;
    font-family: v.$font-subtitle;
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

.checkbox-group {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 10px;
    margin-bottom: 25px;

    input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: v.$color-peach-dark;
        cursor: pointer;
    }
}

.terms-label {
    font-family: v.$font-subtitle;
    font-size: 0.95rem;
    color: v.$color-green-dark;
    cursor: pointer;
    line-height: 1.4;
}

.register-footer {
    margin-top: 25px;
    text-align: center;
    font-family: v.$font-subtitle;
    color: v.$color-green-dark;
}

.register-link {
    color: v.$color-green-dark;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
        color: v.$color-peach-dark;
        text-decoration: underline;
    }

    &--bold {
        font-weight: v.$weight-bold;
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
