<script setup lang="ts">
/**
 * Vista principal (Home)
 * Muestra el hero, valores de la clínica, carrusel de mascotas y servicios
 */
import { ref, onMounted } from 'vue';
import { usePetStore } from '@/stores/petStore';
import PetCard from '@/components/PetCard.vue';

const petStore = usePetStore();
const carouselTrack = ref<HTMLElement | null>(null);

const loadPets = async () => {
    await petStore.fetchPets();
};

// Cuando la página se monta, cargamos las mascotas
onMounted(() => {
    loadPets();
});

// Función para desplazar el carrusel hacia la derecha
const scrollNext = () => {
    if (carouselTrack.value) {
        carouselTrack.value.scrollBy({ left: 325, behavior: 'smooth' });
    }
};

// Función para desplazar el carrusel hacia la izquierda
const scrollPrev = () => {
    if (carouselTrack.value) {
        carouselTrack.value.scrollBy({ left: -325, behavior: 'smooth' });
    }
};
</script>

<template>
    <main class="home">
        <section class="hero">
            <h1 class="hero__title">
                Cuidamos vidas.<br>
                <span>Unimos familias.</span>
            </h1>
            <p class="hero__subtitle">Clínica veterinaria y centro de adopción.</p>
        </section>

        <section class="photos-simple">
            <div class="photos-simple__container">
                <img src="@/assets/images/home/gatoconglobo.png" alt="Pacientes" class="photos-simple__img">
                <img src="@/assets/images/home/veterinariaglobo.png" alt="Atención" class="photos-simple__img">
            </div>
        </section>

        <section class="home-cta">
            <router-link to="/appointments" class="btn btn--primary">¡Pide cita!</router-link>
            <router-link to="/pets" class="btn btn--secondary">Ver todas las mascotas</router-link>
        </section>

        <section class="values">
            <div class="value">
                <img src="@/assets/images/home/corazones.png" alt="" class="value__icon">
                <h3 class="value__title">Tú cuidas a tu mascota</h3>
                <p class="value__text">Recibe la mejor atención médica con nuestros especialistas.</p>
            </div>
            <div class="value">
                <img src="@/assets/images/home/visita.png" alt="" class="value__icon">
                <h3 class="value__title">Tu visita financia rescates</h3>
                <p class="value__text">Parte de tu consulta se destina a salvar animales sin hogar.</p>
            </div>
            <div class="value">
                <img src="@/assets/images/home/finalesFelices.png" alt="" class="value__icon">
                <h3 class="value__title">Creamos finales felices</h3>
                <p class="value__text">Rehabilitamos y encontramos familias para los que más lo necesitan.</p>
            </div>
        </section>

        <section class="adoptions">
            <h2 class="adoptions__title">Conoce a nuestros pequeños</h2>

            <div class="carousel-container">
                <button @click="scrollPrev" class="carousel-btn prev">❮</button>

                <div class="carousel-track" ref="carouselTrack">
                    <PetCard v-for="pet in petStore.pets" :key="pet.pet_id" :pet="pet" />
                </div>

                <button @click="scrollNext" class="carousel-btn next">❯</button>
            </div>
        </section>

        <section class="services">
            <h2 class="services__title">Servicios veterinarios de excelencia</h2>
            <div class="services__grid">
                <div class="service-card">
                    <img src="@/assets/images/home/medicinaPreventiva.png" alt="">
                    <h3>Medicina Preventiva</h3>
                </div>
                <div class="service-card">
                    <img src="@/assets/images/home/cirugíaAvanzada.png" alt="">
                    <h3>Cirugía avanzada</h3>
                </div>
                <div class="service-card">
                    <img src="@/assets/images/home/diagnosticoImagen.png" alt="">
                    <h3>Diagnóstico por imagen</h3>
                </div>
                <div class="service-card">
                    <img src="@/assets/images/home/planesBienestar.png" alt="">
                    <h3>Planes de bienestar</h3>
                </div>
                <div class="service-card">
                    <img src="@/assets/images/home/laboratorioClínico.png" alt="">
                    <h3>Laboratorio de análisis clínico</h3>
                </div>
                <div class="service-card service-card--urgent">
                    <img src="@/assets/images/home/urgencias.png" alt="">
                    <h3>Urgencias 24h</h3>
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;
@use '../assets/styles/components/buttons';

.home {
    background: v.$color-green-light;
    padding-top: 10px;
    min-height: 100vh;
    text-align: center;
}

/* HERO */
.hero {
    padding: 60px 20px 80px;

    &__title {
        font-family: v.$font-title;
        font-size: 2.9rem;
        color: v.$color-green-dark;
        line-height: 1.1;

        span {
            display: block;
            font-size: 4rem;
            color: v.$color-peach-dark;
        }
    }

    &__subtitle {
        font-family: v.$font-subtitle;
        font-size: 1.5rem;
        color: v.$color-green-dark;
        margin-top: 20px;
    }
}

/* PHOTOS */
.photos-simple {
    padding: 10px 20px 100px;

    &__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 50px;
        max-width: 1000px;
        margin: 0 auto;

        @media (min-width: 768px) {
            flex-direction: row;
            justify-content: center;
            gap: 80px;
        }
    }

    &__img {
        width: 100%;
        max-width: 440px;
        border-radius: 28px;
    }
}

/* CTA */
.home-cta {
    padding: 0 20px 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 35px;

    @media (min-width: 640px) {
        flex-direction: row;
        justify-content: center;
    }
}

/* VALUES */
.values {
    padding: 80px 20px;
    display: flex;
    flex-direction: column;
    gap: 60px;
    max-width: 1200px;
    margin: 0 auto;

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: center;
    }
}

.value {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    &__icon {
        width: 180px;
        margin-bottom: 25px;
    }

    &__title {
        font-family: v.$font-title;
        font-size: 1.6rem;
        color: v.$color-green-dark;
        margin-bottom: 15px;
    }

    &__text {
        font-family: v.$font-subtitle;
        color: v.$color-green-dark;
        line-height: 1.6;
    }
}

/* ADOPTIONS & CAROUSEL */
.adoptions {
    padding: 80px 0;

    &__title {
        font-family: v.$font-title;
        font-size: 2.9rem;
        color: v.$color-green-dark;
        margin-bottom: 40px;
    }
}

.carousel-container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 60px;
}

.carousel-track {
    display: flex;
    gap: 25px;
    overflow-x: hidden;
    scroll-behavior: smooth;
    padding: 20px 5px;
}



.carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: v.$color-peach-medium;
    border: none;
    border-radius: 8px;
    width: 45px;
    height: 45px;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: v.$color-green-dark;
    transition: all 0.3s ease;

    &:hover {
        background-color: v.$color-peach-dark;
        color: white;
    }

    &.prev {
        left: 10px;
    }

    &.next {
        right: 10px;
    }
}

/* SERVICES */
.services {
    padding: 100px 20px;

    &__title {
        font-family: v.$font-title;
        font-size: 2.3rem;
        color: v.$color-green-dark;
        margin-bottom: 60px;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
        max-width: 1000px;
        margin: 0 auto;

        @media (min-width: 768px) {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

.service-card {
    border: 1.5px solid v.$color-green-dark;
    border-radius: 15px;
    padding: 40px 20px;
    transition: all 0.3s ease;

    img {
        width: 80px;
        margin-bottom: 25px;
    }

    h3 {
        font-family: v.$font-title;
        color: v.$color-green-dark;
    }

    &:hover {
        transform: translateY(-5px);
        background: rgba(0, 0, 0, 0.02);
    }

    &--urgent {
        background: v.$color-peach-ligth;
        border-color: v.$color-peach-dark;

        h3 {
            color: v.$color-peach-dark;
        }
    }
}
</style>