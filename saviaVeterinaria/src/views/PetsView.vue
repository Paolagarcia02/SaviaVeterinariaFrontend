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

// Computed: filtra las mascotas según los criterios de búsqueda y estado
const filteredPets = computed(() => {
    let result = petStore.pets;

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
            <p class="pets-hero__subtitle">Encuentra a tu nuevo mejor amigo</p>
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
                        <option value="Con Dueño">Con Dueño</option>
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
    padding: 60px 20px;
    text-align: center;
    background: linear-gradient(135deg, v.$color-green-dark 0%, v.$color-green-medium 100%);
    color: white;

    &__title {
        font-family: v.$font-title;
        font-size: 3rem;
        margin-bottom: 15px;
    }

    &__subtitle {
        font-family: v.$font-subtitle;
        font-size: 1.3rem;
        opacity: 0.9;
    }
}

.pets-filters {
    padding: 40px 20px;
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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
    padding: 60px 20px;
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
    font-size: 1.2rem;
    color: v.$color-green-dark;
    padding: 60px 20px;
}
</style>
