<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import api from '@/api/axios';
import Swal from 'sweetalert2';
import type { Pet } from '@/models/type';

const props = defineProps<{
  pet: Pet;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
}>();

const authStore = useAuthStore();
const message = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  if (!authStore.isLogged) {
    Swal.fire({
      icon: 'warning',
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para solicitar una adopción.',
      confirmButtonColor: '#f3a683'
    });
    return;
  }

  loading.value = true;
  try {
    await api.post('/AdoptionApplication', {
      user_id: authStore.userId,
      pet_id: props.pet.pet_id,
      message: message.value,
      status: "Pendiente"
    });

    Swal.fire({
      icon: 'success',
      title: '¡Solicitud enviada!',
      text: 'Hemos recibido tu solicitud de adopción. Te contactaremos pronto.',
      confirmButtonColor: '#f3a683'
    });

    message.value = '';
    emit('success');
    emit('close');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar la solicitud. Inténtalo de nuevo.',
      confirmButtonColor: '#f3a683'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Solicitar adopción de {{ pet.name }}</h2>
        <button @click="emit('close')" class="close-btn">✕</button>
      </div>

      <div class="pet-summary">
        <img :src="pet.photo_url" :alt="pet.name" class="pet-image">
        <div class="pet-info">
          <h3>{{ pet.name }}</h3>
          <p>{{ pet.species }} • {{ pet.breed || 'Mestizo' }}</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="adoption-form">
        <div class="form-group">
          <label for="message" class="form-label">
            Cuéntanos por qué quieres adoptar a {{ pet.name }}
          </label>
          <textarea
            v-model="message"
            id="message"
            class="form-textarea"
            rows="5"
            placeholder="Describe tu experiencia con mascotas, tu hogar, y por qué crees que serías un buen hogar para esta mascota..."
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" @click="emit('close')" class="btn btn--secondary">
            Cancelar
          </button>
          <button type="submit" :disabled="loading" class="btn btn--primary">
            {{ loading ? 'Enviando...' : 'Enviar solicitud' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px 20px;
  border-bottom: 2px solid v.$color-green-light;
}

.modal-title {
  font-family: v.$font-title;
  font-size: 1.5rem;
  color: v.$color-green-dark;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 5px;
  
  &:hover {
    color: v.$color-peach-dark;
  }
}

.pet-summary {
  display: flex;
  gap: 20px;
  padding: 20px 30px;
  background: v.$color-green-light;
  margin: 0 30px;
  border-radius: 15px;
  align-items: center;
}

.pet-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.pet-info {
  h3 {
    font-family: v.$font-title;
    color: v.$color-green-dark;
    margin: 0 0 5px 0;
  }

  p {
    font-family: v.$font-subtitle;
    color: #666;
    margin: 0;
  }
}

.adoption-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-family: v.$font-subtitle;
  font-weight: v.$weight-bold;
  color: v.$color-green-dark;
  margin-bottom: 10px;
}

.form-textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid v.$color-green-medium;
  border-radius: 10px;
  font-family: v.$font-subtitle;
  font-size: 1rem;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: v.$color-peach-dark;
  }
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: v.$font-title;
  font-weight: bold;
  cursor: pointer;
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
</style>