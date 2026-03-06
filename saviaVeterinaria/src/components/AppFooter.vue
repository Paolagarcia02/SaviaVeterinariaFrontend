<script setup lang="ts">
// Componente del footer - No requiere lógica JavaScript por ahora
</script>

<template>
    <footer class="footer">
        <div class="container footer__container">
            <!-- Sección de marca/logo -->
            <div class="footer__brand">
                <a class="footer__logo-link">
                    <span class="footer__logo-text">SAVIA</span>
                </a>
                <p class="footer__slogan">Cuidamos vidas, unimos familias.</p>
            </div>

            <!-- Sección de enlaces de navegación -->
            <div class="footer__column">
                <h3 class="footer__title">Explora</h3>
                <ul class="footer__list">
                    <li><router-link to="/" class="footer__link">Inicio</router-link></li>
                    <li><router-link to="/pets" class="footer__link">Mascotas</router-link></li>
                    <li><a href="./service.html" class="footer__link">Servicios</a></li>
                    <li><a href="./contact.html" class="footer__link">Contacto</a></li>
                </ul>
            </div>

            <!-- Sección de enlaces legales -->
            <div class="footer__column">
                <h3 class="footer__title">Legal</h3>
                <ul class="footer__list">
                    <li><a class="footer__link">Aviso Legal</a></li>
                    <li><a class="footer__link">Privacidad</a></li>
                    <li><a class="footer__link">Política de Cookies</a></li>
                </ul>
            </div>

            <!-- Sección de contacto y redes sociales -->
            <div class="footer__column">
                <h3 class="footer__title">Urgencias</h3>
                <p class="footer__text">
                    📞 <a class="footer__phone">976-254-051</a>
                </p>
                <div class="footer__social">
                    <a class="social-link" aria-label="Instagram">Instagram</a>
                    <a class="social-link" aria-label="Facebook">Facebook</a>
                </div>
            </div>
        </div>

        <!-- Sección de copyright -->
        <div class="footer__bottom">
            <p class="footer__copyright">© 2025 Clínica Veterinaria SAVIA.</p>
        </div>
    </footer>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.footer {
    background-color: v.$color-green-dark;
    color: v.$color-peach-ligth;
    padding-top: 60px;
    margin-top: auto;

    &__container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
        padding-bottom: 40px;

        @media (min-width: 768px) {
            grid-template-columns: 1.5fr 1fr 1fr 1fr;
            text-align: left;
            align-items: start;
        }
    }

    // --- MARCA ---
    &__brand {
        display: flex;
        flex-direction: column;
        align-items: center;

        @media (min-width: 768px) {
            align-items: flex-start;
        }
    }

    &__logo-text {
        font-family: v.$font-title;
        font-size: 2.5rem;
        font-weight: v.$weight-bold;
        color: v.$color-peach-medium;
        text-transform: uppercase;
        letter-spacing: 2px;
        line-height: 1;
    }

    &__slogan {
        font-family: v.$font-subtitle;
        font-size: 1rem;
        opacity: 0.8;
        margin-top: 10px;
        font-style: italic;
    }

    // --- COLUMNAS Y ENLACES ---
    &__title {
        font-family: v.$font-title;
        font-size: 1.2rem;
        color: v.$color-peach-medium;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    &__list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    &__link {
        display: block;
        color: v.$color-peach-ligth;
        text-decoration: none;
        font-family: v.$font-subtitle;
        margin-bottom: 10px;
        transition: color 0.3s ease;
        font-size: 0.95rem;

        &:hover {
            color: v.$color-peach-medium;
            transform: translateX(5px);
            display: inline-block;
        }
    }

    // --- CONTACTO RÁPIDO ---
    &__phone {
        color: v.$color-peach-ligth;
        text-decoration: none;
        font-weight: bold;
        font-size: 1.1rem;

        &:hover {
            color: v.$color-peach-medium;
        }
    }

    &__text {
        font-family: v.$font-subtitle;
        margin-bottom: 15px;
    }

    &__social {
        display: flex;
        gap: 15px;
        justify-content: center;

        @media (min-width: 768px) {
            justify-content: flex-start;
        }

        .social-link {
            color: v.$color-green-dark;
            background-color: v.$color-peach-medium;
            padding: 5px 10px;
            border-radius: 4px;
            text-decoration: none;
            font-family: v.$font-title;
            font-size: 0.9rem;
            font-weight: bold;
            transition: all 0.3s ease;

            &:hover {
                background-color: v.$color-peach-ligth;
                transform: translateY(-3px);
            }
        }
    }

    // --- COPYRIGHT ---
    &__bottom {
        background-color: rgba(0, 0, 0, 0.2); 
        padding: 20px;
        text-align: center;
        font-family: v.$font-subtitle;
        font-size: 0.85rem;
        color: v.$color-peach-ligth;
        opacity: 0.7;
    }
}
</style>
