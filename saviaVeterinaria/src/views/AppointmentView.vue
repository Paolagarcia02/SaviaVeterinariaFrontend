<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import type { Pet, Franchise } from '@/models/type';

const authStore = useAuthStore();
const router = useRouter();

const userPets = ref<Pet[]>([]);
const franchises = ref<Franchise[]>([]);
const loading = ref(true);

const selectedPet = ref('');
const selectedFranchise = ref('');
const appointmentDate = ref('');
const appointmentTime = ref('');
const reason = ref('');

onMounted(async () => {
  if (!authStore.isLogged) {
    router.push('/auth/login');
    return;
  }
  await loadData();
});

const loadData = async () => {
  try {
    const [petsResponse, franchisesResponse] = await Promise.all([
      api.get('/Pet/user'),
      api.get('/Franchise')
    ]);
    userPets.value = petsResponse.data;
    franchises.value = franchisesResponse.data;
    
    // Seleccionar primera franquicia por defecto
    if (franchises.value.length > 0) {
      selectedFranchise.value = franchises.value[0].franchise_id.toString();
    }
  } catch (error) {
    console.error('Error cargando datos:', error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!selectedPet.value || !appointmentDate.value || !appointmentTime.value || !reason.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor completa todos los campos obligatorios'
    });
    return;
  }

  try {
    const dateTime = `${appointmentDate.value}T${appointmentTime.value}:00`;
    
    await api.post('/Appointment', {
      date_time: dateTime,
      reason: reason.value,
      pet_id: parseInt(selectedPet.value),
      franchise_id: parseInt(selectedFranchise.value)
    });

    Swal.fire({
      icon: 'success',
      title: '¡Cita solicitada!',
      text: 'Hemos recibido tu solicitud de cita. Te contactaremos pronto para confirmarla.'
    });

    // Limpiar formulario
    selectedPet.value = '';
    appointmentDate.value = '';
    appointmentTime.value = '';
    reason.value = '';
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo solicitar la cita. Inténtalo de nuevo.'
    });
  }
};
</script>

<template>
  <main class="appointment-page">
    <section class="appointment-hero">
      <h1 class="appointment-hero__title">Pedir Cita</h1>
      <p class="appointment-hero__subtitle">Solicita una cita para tu mascota</p>
    </section>

    <div class="appointment-container">
      <div v-if="loading" class="loading">Cargando...</div>
      
      <form v-else @submit.prevent="handleSubmit" class="appointment-form">
        <div class="form-group">
          <label for="pet" class="form-label">Mascota *</label>
          <select v-model="selectedPet" id="pet" class="form-select" required>
            <option value="">Selecciona una mascota</option>
            <option v-for="pet in userPets" :key="pet.pet_id" :value="pet.pet_id">
              {{ pet.name }} ({{ pet.species }})
            </option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date" class="form-label">Fecha *</label>
            <input 
              v-model="appointmentDate" 
              type="date" 
              id="date" 
              class="form-input"
              :min="new Date().toISOString().split('T')[0]"
              required
            >
          </div>

          <div class="form-group">
            <label for="time" class="form-label">Hora *</label>
            <input 
              v-model="appointmentTime" 
              type="time" 
              id="time" 
              class="form-input"
              min="09:00"
              max="18:00"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label for="franchise" class="form-label">Clínica</label>
          <select v-model="selectedFranchise" id="franchise" class="form-select">
            <option v-for="franchise in franchises" :key="franchise.franchise_id" :value="franchise.franchise_id">
              {{ franchise.name }} - {{ franchise.address }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="reason" class="form-label">Motivo de la cita *</label>
          <textarea 
            v-model="reason" 
            id="reason" 
            class="form-textarea"
            rows="4"
            placeholder="Describe el motivo de la consulta..."
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <router-link to="/" class="btn btn--secondary">Cancelar</router-link>
          <button type="submit" class="btn btn--primary">Solicitar Cita</button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.appointment-page {
  background: v.$color-green-light;
  min-height: 100vh;
  padding-bottom: 80px;
}

.appointment-hero {
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

.appointment-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.appointment-form {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-label {
  display: block;
  font-family: v.$font-subtitle;
  font-weight: bold;
  color: v.$color-green-dark;
  margin-bottom: 8px;
}

.form-input,
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

    &:hover {
      background-color: v.$color-peach-medium;
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