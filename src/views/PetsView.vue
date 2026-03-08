<script setup lang="ts">
/**
 * Vista de listado de mascotas
 * Muestra todas las mascotas con filtros de búsqueda y estado
 */
import { ref, computed, onMounted } from 'vue';
import { usePetStore } from '@/stores/petStore';
import PetCard from '@/components/PetCard.vue';

const petStore = usePetStore();
const searchQuery = ref('');      // Texto de búsqueda
const selectedStatus = ref('all'); // Estado seleccionado (all, En Adopción, etc.)

// Cuando la vista se monta, cargamos las mascotas
onMounted(() => {
    petStore.fetchPets();
});

const normalizeStatus = (status: string) =>
    status
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

// Computed: filtra las mascotas según los criterios de búsqueda y estado
const filteredPets = computed(() => {
    let result = petStore.pets.filter((pet) => normalizeStatus(pet.status) !== 'con dueno');

    // Filtrar por estado si no es "all"
    if (selectedStatus.value !== 'all') {
        result = result.filter(pet => pet.status === selectedStatus.value);
    }

    // Filtrar por texto de búsqueda (nombre o especie)
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(pet => 
            pet.name.toLowerCase().includes(query) || 
            pet.species.toLowerCase().includes(query)
        );
    }

    return result;
});
</script>

<template>
    <main class="pets-page">
        <section class="pets-hero">
            <h1 class="pets-hero__title">Nuestras Mascotas</h1>
        </section>

        <section class="pets-filters">
            <div class="container">
                <div class="filters-wrapper">
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        class="search-input" 
                        placeholder="Buscar por nombre o especie..."
                    >
                    
                    <select v-model="selectedStatus" class="status-select">
                        <option value="all">Todos los estados</option>
                        <option value="En Adopción">En Adopción</option>
                        <option value="Adoptado">Adoptado</option>
                    </select>
                </div>
            </div>
        </section>

        <section class="pets-grid">
            <div class="container">
                <div v-if="petStore.loading" class="loading">Cargando mascotas...</div>
                
                <div v-else-if="filteredPets.length === 0" class="no-results">
                    No se encontraron mascotas con esos criterios
                </div>
                
                <div v-else class="grid">
                    <PetCard 
                        v-for="pet in filteredPets" 
                        :key="pet.pet_id" 
                        :pet="pet" 
                    />
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.pets-page {
    background: v.$color-green-light;
    min-height: 100vh;
}

.pets-hero {
    padding: 60px 20px 30px;
    text-align: center;

    &__title {
        font-family: v.$font-title;
        font-size: 3rem;
        color: v.$color-green-dark;
        margin-bottom: 15px;
    }

    &__subtitle {
        font-family: v.$font-subtitle;
        font-size: 1.3rem;
        color: v.$color-green-dark;
        opacity: 0.8;
    }
}

.pets-filters {
    padding: 0 20px 30px;
}

.filters-wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 800px;
    margin: 0 auto;

    @media (min-width: 768px) {
        flex-direction: row;
    }
}

.search-input, .status-select {
    padding: 12px 20px;
    border: 2px solid v.$color-green-medium;
    border-radius: 8px;
    font-family: v.$font-subtitle;
    font-size: 1rem;
    outline: none;
    background: #eef6e5;

    &:focus {
        border-color: v.$color-peach-dark;
    }
}

.search-input {
    flex: 2;
}

.status-select {
    flex: 1;
    cursor: pointer;
}

.pets-grid {
    padding: 20px 20px 64px;
}

.grid {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto;
    justify-content: center;
}

.loading, .no-results {
    text-align: center;
    font-family: v.$font-subtitle;
    font-size: 1.1rem;
    color: v.$color-green-dark;
    background: rgba(212, 230, 198, 0.75);
    border: 1px solid rgba(46, 91, 64, 0.2);
    border-radius: 14px;
    padding: 28px 20px;
    max-width: 760px;
    margin: 0 auto;
}
</style>
