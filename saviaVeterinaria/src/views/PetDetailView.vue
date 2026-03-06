<script setup lang="ts">
/**
 * Vista de detalle de una mascota
 * Muestra toda la información de una mascota específica
 */
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import type { Pet } from '@/models/type';

const route = useRoute();
const router = useRouter();

// Estado para almacenar los datos de la mascota
const pet = ref<Pet | null>(null);

// Estado de carga
const loading = ref(true);

// Computed: calcula la edad de la mascota a partir de su fecha de nacimiento
const petAge = computed(() => {
    if (!pet.value?.birth_date) return 'Desconocida';
    const birth = new Date(pet.value.birth_date);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    // Si tiene más de 1 año, mostramos años, si no, meses
    if (years > 0) return `${years} año${years > 1 ? 's' : ''}`;
    return `${months} mes${months !== 1 ? 'es' : ''}`;
});

// Función para normalizar el estado (quitar acentos y espacios para CSS)
const normalizeStatus = (status: string) => {
    return status
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quita acentos
        .replace(/ /g, '-');              // Reemplaza espacios por guiones
};

// Al montar el componente, cargamos los datos de la mascota
onMounted(async () => {
    try {
        const response = await api.get(`/Pet/${route.params.id}`);
        pet.value = response.data;
    } catch (error) {
        console.error('Error cargando mascota:', error);
        router.push('/pets');
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <main class="pet-detail" v-if="!loading && pet">
        <div class="container">
            <button @click="router.back()" class="back-btn">← Volver</button>
            
            <div class="pet-content">
                <div class="pet-image">
                    <img :src="pet.photo_url" :alt="pet.name">
                    <span :class="['status-badge', normalizeStatus(pet.status)]">
                        {{ pet.status }}
                    </span>
                </div>

                <div class="pet-info">
                    <h1 class="pet-name">{{ pet.name }}</h1>
                    
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Especie</span>
                            <span class="info-value">{{ pet.species }}</span>
                        </div>
                        
                        <div class="info-item" v-if="pet.breed">
                            <span class="info-label">Raza</span>
                            <span class="info-value">{{ pet.breed }}</span>
                        </div>
                        
                        <div class="info-item">
                            <span class="info-label">Edad</span>
                            <span class="info-value">{{ petAge }}</span>
                        </div>
                    </div>

                    <div class="description">
                        <h3>Sobre {{ pet.name }}</h3>
                        <p>{{ pet.description || 'Sin descripción disponible' }}</p>
                    </div>

                    <div class="actions" v-if="pet.status === 'En Adopción'">
                        <button class="btn btn--primary">¡Quiero adoptarlo!</button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <div v-else-if="loading" class="loading-container">
        <p>Cargando información...</p>
    </div>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.pet-detail {
    background: v.$color-green-light;
    min-height: 100vh;
    padding: 40px 20px;
}

.back-btn {
    background: v.$color-peach-medium;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-family: v.$font-subtitle;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 30px;
    transition: all 0.3s;

    &:hover {
        background: v.$color-peach-dark;
        color: white;
    }
}

.pet-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
}

.pet-image {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);

    img {
        width: 100%;
        height: 500px;
        object-fit: cover;
    }
}

.status-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9rem;
    background: white;
    
    &.con-dueno { background: #e3f2fd; color: #1976d2; }
    &.en-adopcion { background: #fff3e0; color: #f57c00; }
    &.adoptado { background: #e8f5e9; color: #388e3c; }
}

.pet-info {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.pet-name {
    font-family: v.$font-title;
    font-size: 3rem;
    color: v.$color-green-dark;
    margin-bottom: 30px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.info-label {
    font-family: v.$font-subtitle;
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
}

.info-value {
    font-family: v.$font-title;
    font-size: 1.3rem;
    color: v.$color-green-dark;
}

.description {
    margin-top: 30px;
    padding-top: 30px;
    border-top: 2px solid v.$color-green-light;

    h3 {
        font-family: v.$font-title;
        color: v.$color-green-dark;
        margin-bottom: 15px;
    }

    p {
        font-family: v.$font-subtitle;
        line-height: 1.8;
        color: #555;
    }
}

.actions {
    margin-top: 40px;
    
    .btn {
        width: 100%;
        padding: 15px;
        font-size: 1.2rem;
    }
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: v.$font-subtitle;
    font-size: 1.5rem;
}
</style>
