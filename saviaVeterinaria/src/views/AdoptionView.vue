<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { usePetStore } from '@/stores/petStore';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import type { Pet, AdoptionApplication } from '@/models/type';

const authStore = useAuthStore();
const petStore = usePetStore();
const router = useRouter();

const selectedPet = ref('');
const message = ref('');
const loading = ref(false);

const availablePets = ref<Pet[]>([]);
const adoptionApplications = ref<AdoptionApplication[]>([]);

onMounted(async () => {
  if (!authStore.isLogged) {
    router.push('/auth/login');
    return;
  }
  await loadAvailablePets();
  await loadUserApplications();
});

const loadAvailablePets = async () => {
  await petStore.fetchPets();
  availablePets.value = petStore.pets.filter(pet => pet.status === 'En Adopción');
};

const loadUserApplications = async () => {
  try {
    const response = await api.get('/AdoptionApplication/user');
    adoptionApplications.value = response.data;
  } catch (error) {
    console.error('Error cargando solicitudes:', error);
  }
};

const handleSubmit = async () => {
  if (!selectedPet.value || !message.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor selecciona una mascota y escribe un mensaje'
    });
    return;
  }

  // Verificar si ya tiene una solicitud para esta mascota
  const existingApplication = adoptionApplications.value.find(
    app => app.pet_id === parseInt(selectedPet.value) && app.status === 'Pendiente'
  );
  
  if (existingApplication) {
    Swal.fire({
      icon: 'warning',
      title: 'Solicitud existente',
      text: 'Ya tienes una solicitud pendiente para esta mascota'
    });
    return;
  }

  loading.value = true;
  try {
    await api.post('/AdoptionApplication', {
      user_id: authStore.userId,
      pet_id: parseInt(selectedPet.value),
      message: message.value,
      status: "Pendiente"
    });

    Swal.fire({
      icon: 'success',
      title: '¡Solicitud enviada!',
      text: 'Hemos recibido tu solicitud de adopción. Te contactaremos pronto.'
    });

    selectedPet.value = '';
    message.value = '';
    await loadUserApplications(); // Recargar solicitudes
  } catch (error) {
    console.error('Error completo:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar la solicitud. Inténtalo de nuevo.'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main class="adoption-page">
    <section class="adoption-hero">
      <h1 class="adoption-hero__title">Formulario de Adopción</h1>
      <p class="adoption-hero__subtitle">Encuentra tu compañero perfecto</p>
    </section>

    <div class="adoption-container">
      <div v-if="loading" class="loading">Enviando solicitud...</div>
      
      <form v-else @submit.prevent="handleSubmit" class="adoption-form">
        <div class="form-group">
          <label for="pet" class="form-label">Mascota que deseas adoptar *</label>
          <select v-model="selectedPet" id="pet" class="form-select" required>
            <option value="">Selecciona una mascota</option>
            <option v-for="pet in availablePets" :key="pet.pet_id" :value="pet.pet_id">
              {{ pet.name }} - {{ pet.species }} ({{ pet.breed || 'Mestizo' }})
            </option>
          </select>
        </div>

        <div v-if="selectedPet" class="pet-preview">
          <div class="pet-info">
            <img 
              :src="availablePets.find(p => p.pet_id === parseInt(selectedPet))?.photo_url" 
              :alt="availablePets.find(p => p.pet_id === parseInt(selectedPet))?.name"
              class="pet-image"
            >
            <div class="pet-details">
              <h3>{{ availablePets.find(p => p.pet_id === parseInt(selectedPet))?.name }}</h3>
              <p>{{ availablePets.find(p => p.pet_id === parseInt(selectedPet))?.description }}</p>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="message" class="form-label">Mensaje de solicitud *</label>
          <textarea 
            v-model="message" 
            id="message" 
            class="form-textarea"
            rows="6"
            placeholder="Cuéntanos sobre ti, tu experiencia con mascotas, tu hogar y por qué quieres adoptar a esta mascota..."
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <router-link to="/" class="btn btn--secondary">Cancelar</router-link>
          <button type="submit" :disabled="loading" class="btn btn--primary">
            {{ loading ? 'Enviando...' : 'Enviar Solicitud' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.adoption-page {
  background: v.$color-green-light;
  min-height: 100vh;
  padding-bottom: 80px;
}

.adoption-hero {
  padding: 60px 20px;
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

.adoption-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.adoption-form {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-family: v.$font-subtitle;
  font-weight: bold;
  color: v.$color-green-dark;
  margin-bottom: 8px;
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid v.$color-green-medium;
  border-radius: 8px;
  font-family: v.$font-subtitle;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: v.$color-peach-dark;
  }
}

.form-textarea {
  resize: vertical;
}

.pet-preview {
  background: v.$color-green-light;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
}

.pet-info {
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.pet-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.pet-details {
  h3 {
    font-family: v.$font-title;
    color: v.$color-green-dark;
    margin: 0 0 10px 0;
  }

  p {
    font-family: v.$font-subtitle;
    color: #666;
    margin: 0;
    line-height: 1.5;
  }
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: v.$font-title;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.3s;

  &--primary {
    background-color: v.$color-peach-dark;
    color: white;

    &:hover:not(:disabled) {
      background-color: v.$color-peach-medium;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &--secondary {
    background-color: #f5f5f5;
    color: #666;

    &:hover {
      background-color: #e0e0e0;
    }
  }
}

.loading {
  text-align: center;
  font-family: v.$font-subtitle;
  font-size: 1.2rem;
  color: v.$color-green-dark;
  padding: 60px 20px;
}
</style>