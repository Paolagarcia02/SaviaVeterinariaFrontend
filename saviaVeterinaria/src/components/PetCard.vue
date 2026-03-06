<script setup lang="ts">
/**
 * Componente PetCard - Tarjeta para mostrar información básica de una mascota
 * Se usa en el carrusel de la página principal y en el listado de mascotas
 */
defineProps<{
    pet: {
        pet_id: number;      
        name: string;       
        species: string;    
        photo_url: string;   
    }
}>();
</script>

<template>
    <article class="adoption-card">
        <div class="adoption-card__image-wrapper">
            <img :src="pet.photo_url" :alt="pet.name" class="adoption-card__img">
        </div>
        <div class="adoption-card__content">
            <div class="adoption-card__info">
                <h3 class="adoption-card__name">{{ pet.name }}</h3>
                <p class="adoption-card__desc">{{ pet.species }}</p>
            </div>
            <router-link :to="'/pet/' + pet.pet_id" class="btn btn--primary btn-card">
                Conóceme
            </router-link>
        </div>
    </article>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;
@use '../assets/styles/components/buttons';

.adoption-card {
    flex: 0 0 300px;
    background-color: v.$color-peach-ligth;
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;

    &__image-wrapper {
        height: 280px;
        width: 100%;
        flex-shrink: 0;
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__content {
        padding: 25px;
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    &__info {
        flex: 1;
        min-height: 80px;
    }

    &__name {
        font-family: v.$font-title;
        font-size: 1.8rem;
        color: v.$color-green-dark;
        margin: 0 0 10px 0;
    }

    &__desc {
        font-family: v.$font-subtitle;
        color: v.$color-green-dark;
        margin: 0;
    }

    .btn-card {
        width: 100%;
        padding: 12px 0;
        font-size: 1rem;
        text-align: center;
        margin-top: 15px;
    }
}
</style>