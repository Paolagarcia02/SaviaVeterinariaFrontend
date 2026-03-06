<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import type { Pet } from '@/models/type';
import AdoptionModal from '@/components/AdoptionModal.vue';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const pet = ref<Pet | null>(null);
const loading = ref(true);
const showAdoptionModal = ref(false);

const petAge = computed(() => {
    if (!pet.value?.birth_date) return 'Desconocida';
    const birth = new Date(pet.value.birth_date);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years > 0) return `${years} año${years > 1 ? 's' : ''}`;
    return `${months} mes${months !== 1 ? 'es' : ''}`;
});

const normalizeStatus = (status: string) => {
    return status
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ /g, '-');
};

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

const openAdoptionModal = () => {
    showAdoptionModal.value = true;
};

const closeAdoptionModal = () => {
    showAdoptionModal.value = false;
};

const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha desconocida';
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long'
    });
};

const shareOnSocial = () => {
    const text = `¡Ayuda a ${pet.value?.name} a encontrar hogar! 🐾`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: `Adopta a ${pet.value?.name}`,
            text: text,
            url: url
        });
    } else {
        navigator.clipboard.writeText(`${text} ${url}`);
        Swal.fire({
            icon: 'success',
            title: '¡Enlace copiado!',
            text: 'El enlace se ha copiado al portapapeles',
            timer: 2000,
            showConfirmButton: false
        });
    }
};
</script>

<template>
    <main class="pet-detail" v-if="!loading && pet">
        <div class="container">
            <button @click="router.back()" class="back-btn">← Volver</button>
            
            <div class="pet-content">
                <div class="pet-image-section">
                    <div class="pet-image">
                        <img :src="pet.photo_url" :alt="pet.name">
                        <span :class="['status-badge', normalizeStatus(pet.status)]">
                            {{ pet.status }}
                        </span>
                    </div>
                    
                    <div class="pet-stats">
                        <div class="stat-item">
                            <span class="stat-icon">🎂</span>
                            <div class="stat-info">
                                <span class="stat-label">Edad</span>
                                <span class="stat-value">{{ petAge }}</span>
                            </div>
                        </div>
                        
                        <div class="stat-item">
                            <span class="stat-icon">📅</span>
                            <div class="stat-info">
                                <span class="stat-label">En SAVIA desde</span>
                                <span class="stat-value">{{ formatDate(pet.created_at) }}</span>
                            </div>
                        </div>
                        
                        <div class="stat-item" v-if="pet.owner_id">
                            <span class="stat-icon">👤</span>
                            <div class="stat-info">
                                <span class="stat-label">Dueño</span>
                                <span class="stat-value">Registrado</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pet-info">
                    <div class="pet-header">
                        <h1 class="pet-name">{{ pet.name }}</h1>
                        <div class="pet-subtitle">
                            <span class="species">{{ pet.species }}</span>
                            <span v-if="pet.breed" class="breed">• {{ pet.breed }}</span>
                        </div>
                    </div>
                    
                    <div class="info-cards">
                        <div class="info-card">
                            <h3 class="card-title">📋 Información básica</h3>
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
                                    <span class="info-label">Edad aproximada</span>
                                    <span class="info-value">{{ petAge }}</span>
                                </div>
                                
                                <div class="info-item">
                                    <span class="info-label">Estado</span>
                                    <span :class="['status-text', normalizeStatus(pet.status)]">{{ pet.status }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-card description-card">
                            <h3 class="card-title">❤️ Sobre {{ pet.name }}</h3>
                            <p class="description-text">{{ pet.description || `${pet.name} es una mascota muy especial que está buscando un hogar lleno de amor. ¡Podría ser el compañero perfecto que estás buscando!` }}</p>
                        </div>
                        
                        <div class="info-card" v-if="pet.status === 'En Adopción'">
                            <h3 class="card-title">🏠 ¿Listo para adoptar?</h3>
                            <p class="adoption-text">{{ pet.name }} está esperando una familia que le brinde amor y cuidados. Si crees que podrías ser su hogar ideal, ¡no dudes en contactarnos!</p>
                            <div class="adoption-requirements">
                                <h4>Requisitos básicos:</h4>
                                <ul>
                                    <li>Ser mayor de edad</li>
                                    <li>Tener tiempo para dedicar a la mascota</li>
                                    <li>Compromiso de cuidado a largo plazo</li>
                                    <li>Espacio adecuado en el hogar</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="actions" v-if="pet.status === 'En Adopción'">
                        <button @click="openAdoptionModal" class="btn btn--primary btn--large">
                            <span class="btn-icon">💕</span>
                            ¡Quiero adoptar a {{ pet.name }}!
                        </button>
                        <button @click="shareOnSocial" class="btn btn--secondary">
                            <span class="btn-icon">📱</span>
                            Compartir
                        </button>
                    </div>
                    
                    <div class="actions" v-else-if="pet.status === 'Adoptado'">
                        <div class="adopted-message">
                            <span class="adopted-icon">🎉</span>
                            <div class="adopted-text">
                                <h3>¡{{ pet.name }} ya tiene hogar!</h3>
                                <p>Nos alegra saber que {{ pet.name }} ha encontrado una familia que lo ama.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <AdoptionModal 
            v-if="pet"
            :pet="pet" 
            :show="showAdoptionModal" 
            @close="closeAdoptionModal"
            @success="closeAdoptionModal"
        />
    </main>

    <div v-else-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando información de la mascota...</p>
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
    padding: 12px 24px;
    border-radius: 25px;
    font-family: v.$font-subtitle;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 30px;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);

    &:hover {
        background: v.$color-peach-dark;
        color: white;
        transform: translateY(-2px);
    }
}

.pet-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    max-width: 1400px;
    margin: 0 auto;

    @media (min-width: 1024px) {
        grid-template-columns: 1fr 1.5fr;
    }
}

.pet-image-section {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.pet-image {
    position: relative;
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
    aspect-ratio: 1;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.status-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 25px;
    font-weight: bold;
    font-size: 0.9rem;
    background: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    
    &.con-dueno { background: #e3f2fd; color: #1976d2; }
    &.en-adopcion { background: #fff3e0; color: #f57c00; }
    &.adoptado { background: #e8f5e9; color: #388e3c; }
}

.pet-stats {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 15px;
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.stat-icon {
    font-size: 2rem;
    width: 50px;
    text-align: center;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-label {
    font-family: v.$font-subtitle;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 2px;
}

.stat-value {
    font-family: v.$font-title;
    font-size: 1.1rem;
    color: v.$color-green-dark;
    font-weight: bold;
}

.pet-info {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.pet-header {
    text-align: center;
    
    @media (min-width: 1024px) {
        text-align: left;
    }
}

.pet-name {
    font-family: v.$font-title;
    font-size: 3.5rem;
    color: v.$color-green-dark;
    margin-bottom: 10px;
    line-height: 1.1;
}

.pet-subtitle {
    font-family: v.$font-subtitle;
    font-size: 1.3rem;
    color: #666;
    
    .species {
        font-weight: bold;
        color: v.$color-peach-dark;
    }
}

.info-cards {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.info-card {
    background: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
    border: 1px solid rgba(0,0,0,0.05);
}

.card-title {
    font-family: v.$font-title;
    font-size: 1.4rem;
    color: v.$color-green-dark;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-label {
    font-family: v.$font-subtitle;
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    font-weight: bold;
}

.info-value {
    font-family: v.$font-title;
    font-size: 1.2rem;
    color: v.$color-green-dark;
}

.status-text {
    font-family: v.$font-title;
    font-size: 1.2rem;
    font-weight: bold;
    padding: 5px 15px;
    border-radius: 15px;
    
    &.con-dueno { background: #e3f2fd; color: #1976d2; }
    &.en-adopcion { background: #fff3e0; color: #f57c00; }
    &.adoptado { background: #e8f5e9; color: #388e3c; }
}

.description-card {
    background: linear-gradient(135deg, v.$color-peach-ligth 0%, #fff 100%);
}

.description-text {
    font-family: v.$font-subtitle;
    line-height: 1.8;
    color: #555;
    font-size: 1.1rem;
}

.adoption-text {
    font-family: v.$font-subtitle;
    line-height: 1.6;
    color: #555;
    margin-bottom: 20px;
}

.adoption-requirements {
    h4 {
        font-family: v.$font-title;
        color: v.$color-green-dark;
        margin-bottom: 10px;
    }
    
    ul {
        list-style: none;
        padding: 0;
        
        li {
            font-family: v.$font-subtitle;
            color: #666;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
            
            &:before {
                content: '✓';
                position: absolute;
                left: 0;
                color: v.$color-peach-dark;
                font-weight: bold;
            }
        }
    }
}

.actions {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
    
    @media (min-width: 1024px) {
        justify-content: flex-start;
    }
}

.btn {
    padding: 15px 30px;
    border: none;
    border-radius: 25px;
    font-family: v.$font-title;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    
    &--primary {
        background: linear-gradient(135deg, v.$color-peach-dark 0%, v.$color-peach-medium 100%);
        color: white;
        
        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
    }
    
    &--secondary {
        background: white;
        color: v.$color-green-dark;
        border: 2px solid v.$color-green-medium;
        
        &:hover {
            background: v.$color-green-light;
            transform: translateY(-2px);
        }
    }
    
    &--large {
        font-size: 1.2rem;
        padding: 18px 35px;
    }
}

.btn-icon {
    font-size: 1.2em;
}

.adopted-message {
    display: flex;
    align-items: center;
    gap: 20px;
    background: linear-gradient(135deg, #e8f5e9 0%, #fff 100%);
    padding: 30px;
    border-radius: 20px;
    border: 2px solid #4caf50;
}

.adopted-icon {
    font-size: 3rem;
}

.adopted-text {
    h3 {
        font-family: v.$font-title;
        color: #388e3c;
        margin-bottom: 8px;
    }
    
    p {
        font-family: v.$font-subtitle;
        color: #666;
        margin: 0;
    }
}

.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    gap: 20px;
    
    p {
        font-family: v.$font-subtitle;
        font-size: 1.2rem;
        color: v.$color-green-dark;
    }
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid v.$color-green-light;
    border-top: 4px solid v.$color-peach-dark;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
