<script setup lang="ts">
/**
 * Vista principal (Home)
 * Muestra el hero, valores de la clínica, carrusel de mascotas y servicios
 */
import { ref, onMounted, computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import PetCard from '@/components/PetCard.vue';
import HomeServiceCard from '@/components/HomeServiceCard.vue';
import api from '@/api/axios';
import medicinaPreventivaImg from '@/assets/images/home/medicinaPreventiva.png';
import cirugiaAvanzadaImg from '@/assets/images/home/cirugíaAvanzada.png';
import diagnosticoImagenImg from '@/assets/images/home/diagnosticoImagen.png';
import planesBienestarImg from '@/assets/images/home/planesBienestar.png';
import laboratorioClinicoImg from '@/assets/images/home/laboratorioClínico.png';
import urgenciasImg from '@/assets/images/home/urgencias.png';

const petStore = usePetStore();
const carouselTrack = ref<HTMLElement | null>(null);
const defaultQuote = 'El amor por los animales eleva el nivel cultural del pueblo.';
const dailyQuote = ref(defaultQuote);
const carouselFilter = ref('En Adopción');
const homeServices = [
    { title: 'Medicina Preventiva', image: medicinaPreventivaImg },
    { title: 'Cirugía avanzada', image: cirugiaAvanzadaImg },
    { title: 'Diagnóstico por imagen', image: diagnosticoImagenImg },
    { title: 'Planes de bienestar', image: planesBienestarImg },
    { title: 'Laboratorio de análisis clínico', image: laboratorioClinicoImg },
    { title: 'Urgencias 24h', image: urgenciasImg, isUrgent: true }
];

const loadPets = async () => {
    await petStore.fetchPets();
};

const loadDailyQuote = async () => {
    try {
        const response = await api.get('/DailyQuote');
        dailyQuote.value = response.data?.mensaje || response.data?.quote || defaultQuote;
    } catch (error) {
        dailyQuote.value = defaultQuote;
    }
};

const filteredPets = computed(() => {
    return petStore.pets.filter((pet) => pet.status === carouselFilter.value);
});

// Cuando la página se monta, cargamos las mascotas
onMounted(() => {
    loadPets();
    loadDailyQuote();
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
            <div class="daily-quote">
                <p class="quote-text">“{{ dailyQuote }}”</p>
            </div>
        </section>

        <section class="photos-simple">
            <div class="photos-simple__container">
                <img src="@/assets/images/home/gatoconglobo.png" alt="Pacientes" class="photos-simple__img">
                <img src="@/assets/images/home/veterinariaglobo.png" alt="Atención" class="photos-simple__img">
            </div>
        </section>

        <section class="home-cta">
            <router-link to="/appointment" class="btn btn--primary">¡Pide cita!</router-link>
            <router-link to="/adoption" class="btn btn--secondary">¡Adopta aquí!</router-link>
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
            
            <div class="carousel-filters">
                <button 
                    :class="['filter-btn', { active: carouselFilter === 'En Adopción' }]"
                    @click="carouselFilter = 'En Adopción'"
                >
                    En Adopción
                </button>
                <button 
                    :class="['filter-btn', { active: carouselFilter === 'Adoptado' }]"
                    @click="carouselFilter = 'Adoptado'"
                >
                    Adoptado
                </button>
            </div>

            <div class="carousel-container">
                <button @click="scrollPrev" class="carousel-btn prev">❮</button>

                <div class="carousel-track" ref="carouselTrack">
                    <PetCard 
                        v-for="pet in filteredPets" 
                        :key="pet.pet_id" 
                        :pet="pet"
                        :hideButton="carouselFilter === 'Adoptado'"
                    />
                </div>

                <button @click="scrollNext" class="carousel-btn next">❯</button>
            </div>
        </section>

        <section class="services">
            <h2 class="services__title">Servicios veterinarios de excelencia</h2>
            <div class="services__grid">
                <HomeServiceCard
                    v-for="service in homeServices"
                    :key="service.title"
                    :title="service.title"
                    :image="service.image"
                    :isUrgent="service.isUrgent"
                />
            </div>
        </section>

        <section class="ods">
            <h2 class="ods__title">Nuestro proyecto y los ODS</h2>
            <p class="ods__subtitle">SAVIA contribuye a estos 3 Objetivos de Desarrollo Sostenible:</p>
            <div class="ods__grid">
                <article class="ods-card">
                    <span class="ods-card__badge">ODS 3</span>
                    <h3>Salud y bienestar</h3>
                    <p>Mejoramos la salud animal con prevención, diagnóstico y seguimiento veterinario.</p>
                </article>
                <article class="ods-card">
                    <span class="ods-card__badge">ODS 12</span>
                    <h3>Producción y consumo responsables</h3>
                    <p>Fomentamos la adopción responsable y reducimos el abandono animal.</p>
                </article>
                <article class="ods-card">
                    <span class="ods-card__badge">ODS 15</span>
                    <h3>Vida de ecosistemas terrestres</h3>
                    <p>Protegemos la fauna doméstica y promovemos su cuidado ético y sostenible.</p>
                </article>
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

.daily-quote {
    margin-top: 30px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.quote-text {
    font-family: v.$font-subtitle;
    font-size: 1.1rem;
    color: v.$color-green-dark;
    font-style: italic;
    margin: 0;
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

.carousel-filters {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 30px;
}

.filter-btn {
    padding: 10px 25px;
    border: 2px solid v.$color-green-dark;
    background: transparent;
    color: v.$color-green-dark;
    border-radius: 25px;
    font-family: v.$font-subtitle;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: v.$color-green-dark;
        color: white;
    }

    &.active {
        background: v.$color-peach-dark;
        border-color: v.$color-peach-dark;
        color: white;
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

.ods {
    padding: 70px 20px 100px;

    &__title {
        font-family: v.$font-title;
        font-size: 1.95rem;
        color: v.$color-green-dark;
        margin-bottom: 8px;
    }

    &__subtitle {
        font-family: v.$font-subtitle;
        color: #355646;
        margin-bottom: 22px;
        font-size: 0.98rem;
    }

    &__grid {
        max-width: 1000px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;

        @media (min-width: 900px) {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

.ods-card {
    background: transparent;
    border: 1px solid rgba(50, 82, 67, 0.22);
    border-radius: 12px;
    padding: 16px 18px;
    text-align: left;
    transition: border-color 0.2s ease;

    &:hover {
        border-color: rgba(50, 82, 67, 0.4);
    }

    h3 {
        margin: 0 0 7px;
        font-family: v.$font-title;
        color: v.$color-green-dark;
        font-size: 1.15rem;
    }

    p {
        margin: 0;
        font-family: v.$font-subtitle;
        color: v.$color-green-dark;
        line-height: 1.5;
        font-size: 0.95rem;
    }
}

.ods-card__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 999px;
    font-family: v.$font-subtitle;
    font-weight: v.$weight-bold;
    font-size: 0.92rem;
    background: rgba(247, 198, 164, 0.55);
    color: v.$color-green-dark;
    margin-bottom: 8px;
}

</style>
