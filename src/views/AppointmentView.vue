<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import type { Pet } from '@/models/type';

const authStore = useAuthStore();
const router = useRouter();

const userPets = ref<Pet[]>([]);
const availableVets = ref<number[]>([]);
const availableRooms = ref<number[]>([]);
const loading = ref(true);

const selectedPet = ref('');
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
    const franchiseId = Number(authStore.franchiseId || 0);
    const [petsResponse, usersResponse] = await Promise.all([
      api.get('/Pet/user'),
      api.get('/User')
    ]);

    userPets.value = petsResponse.data;
    availableVets.value = Array.isArray(usersResponse.data)
      ? usersResponse.data
          .filter((user: any) => {
            const role = String(user.role || '').toLowerCase();
            return Number(user.franchise_id || 0) === franchiseId && (role === 'vet' || role === 'admin');
          })
          .map((user: any) => Number(user.user_id))
          .filter((id: number) => Number.isFinite(id) && id > 0)
      : [];

    try {
      const roomsResponse = await api.get('/ClinicRoom');
      availableRooms.value = Array.isArray(roomsResponse.data)
        ? roomsResponse.data
            .filter((room: any) => {
              const roomFranchiseId = Number(room.franchise_id ?? room.Franchise_id ?? 0);
              const isActive = room.is_active === undefined
                ? true
                : room.is_active === true || room.is_active === 1 || room.is_active === '1';
              return roomFranchiseId === franchiseId && isActive;
            })
            .map((room: any) => Number(room.room_id ?? room.Room_id))
            .filter((id: number) => Number.isFinite(id) && id > 0)
        : [];
    } catch {
      const roomsFallback = await api.get('/Clinic_room');
      availableRooms.value = Array.isArray(roomsFallback.data)
        ? roomsFallback.data
            .filter((room: any) => {
              const roomFranchiseId = Number(room.franchise_id ?? room.Franchise_id ?? 0);
              const isActive = room.is_active === undefined
                ? true
                : room.is_active === true || room.is_active === 1 || room.is_active === '1';
              return roomFranchiseId === franchiseId && isActive;
            })
            .map((room: any) => Number(room.room_id ?? room.Room_id))
            .filter((id: number) => Number.isFinite(id) && id > 0)
        : [];
    }
  } catch (error) {
    console.error('Error cargando datos:', error);
  } finally {
    loading.value = false;
  }
};

const getAutoDateTime = () => {
  const date = new Date();
  date.setHours(date.getHours() + 1, 0, 0, 0);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}:00`;
};

const handleSubmit = async () => {
  if (!selectedPet.value || !reason.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos requeridos',
      text: 'Por favor completa todos los campos obligatorios'
    });
    return;
  }

  try {
    const petId = Number.parseInt(selectedPet.value, 10);
    const franchiseId = Number(authStore.franchiseId || 0);
    if (!Number.isFinite(petId) || !Number.isFinite(franchiseId)) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos inválidos',
        text: 'No se pudo resolver tu franquicia. Cierra sesión e inicia sesión de nuevo.'
      });
      return;
    }

    const roomId = availableRooms.value[0] || 0;
    if (!roomId) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin salas disponibles',
        text: 'No se encontró una sala activa para esta franquicia.'
      });
      return;
    }

    const vetId = availableVets.value[0] || 0;
    if (!vetId) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin veterinarios disponibles',
        text: 'No se encontró un veterinario activo para esta franquicia.'
      });
      return;
    }
    
    await api.post('/Appointment', {
      date_time: getAutoDateTime(),
      duration_minutes: 30,
      reason: reason.value.trim(),
      pet_id: petId,
      franchise_id: franchiseId,
      vet_id: vetId,
      room_id: roomId,
      status: 'Pendiente'
    });

    Swal.fire({
      icon: 'success',
      title: 'Solicitud enviada',
      text: 'Tu solicitud está pendiente. El equipo asignará día, hora y sala.'
    });

    // Limpiar formulario
    selectedPet.value = '';
    reason.value = '';
  } catch (error: any) {
    console.error('Error POST /Appointment:', error?.response?.data || error);

    const validationErrors = error?.response?.data?.errors;
    const validationMessage =
      validationErrors && typeof validationErrors === 'object'
        ? Object.values(validationErrors).flat().join(' | ')
        : '';

    const backendMessage =
      error?.response?.data?.message ||
      error?.response?.data?.title ||
      validationMessage ||
      (typeof error?.response?.data === 'string' ? error.response.data : '');

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: backendMessage || 'No se pudo solicitar la cita. Inténtalo de nuevo.',
      footer: error?.response?.data ? `<small>${JSON.stringify(error.response.data)}</small>` : ''
    });
  }
};
</script>

<template>
  <main class="appointment-page">
    <section class="appointment-hero">
      <h1 class="appointment-hero__title">Solicitar Cita</h1>
      <p class="appointment-hero__subtitle">Envía la solicitud y te asignaremos día y hora</p>
    </section>

    <div class="appointment-container">
      <div v-if="loading" class="loading">Cargando...</div>
      
      <section v-else class="contact-form-section">
        <h2 class="contact-form-section__title">Rellena los datos de la solicitud</h2>
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-group">
            <label for="pet" class="form-label">Mascota *</label>
            <select v-model="selectedPet" id="pet" class="form-input" required>
              <option disabled value="">Selecciona una mascota</option>
              <option v-for="pet in userPets" :key="pet.pet_id" :value="pet.pet_id">
                {{ pet.name }} ({{ pet.species }})
              </option>
            </select>
          </div>

          <p class="form-hint">La clínica se asigna automáticamente según tu usuario.</p>

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
          
          <button type="submit" class="btn btn--primary btn--full">Solicitar Cita</button>
        </form>
      </section>
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

.contact-form-section {
  background: v.$color-green-light;
  border: 2px solid v.$color-green-dark;
  border-radius: 15px;
  padding: 40px 30px;

  &__title {
    font-family: v.$font-title;
    font-size: 1.8rem;
    color: v.$color-green-dark;
    margin-bottom: 30px;
    text-align: center;
  }
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-hint {
  margin: 0;
  font-family: v.$font-subtitle;
  color: v.$color-green-dark;
  opacity: 0.8;
}

.form-group {
  display: flex;
  flex-direction: column;
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
  font-family: v.$font-subtitle;
  font-weight: v.$weight-bold;
  color: v.$color-green-dark;
  margin-bottom: 8px;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 15px;
  border: 2px solid v.$color-green-medium;
  border-radius: 8px;
  font-family: v.$font-subtitle;
  font-size: 1rem;
  color: v.$color-green-dark;
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: v.$color-peach-dark;
  }
}

// .form-select is not a real element, it's a class on form-input
.form-input[as="select"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%233B5D50'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592c.859 0 1.32 1.013.754 1.658l-4.796 5.484c-.566.647-1.536.647-2.102 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 15px center;
    background-size: 1em;
}


.form-textarea {
  resize: vertical;
}

.loading {
  text-align: center;
  font-family: v.$font-subtitle;
  font-size: 1.2rem;
  color: v.$color-green-dark;
  padding: 40px 20px;
}

.btn--full {
  width: 100%;
  padding: 15px;
  background-color: v.$color-peach-dark;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: v.$font-title;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: v.$color-peach-medium;
    transform: translateY(-2px);
  }
}
</style>
