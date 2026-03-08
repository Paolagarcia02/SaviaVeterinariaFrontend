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
          <p class="form-help">Cuanta más información des, mejor podremos valorar tu solicitud.</p>
        </div>

        <div class="form-actions">
          <button type="button" @click="emit('close')" class="btn btn--secondary btn--small">
            Cancelar
          </button>
          <button type="submit" :disabled="loading" class="btn btn--primary btn--small">
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
  background: rgba(0, 0, 0, 0.52);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(160deg, #dcecd0 0%, #cde2c0 100%);
  border: 1px solid #abc49d;
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 18px 35px rgba(35, 57, 44, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #b3cda5;
}

.modal-title {
  font-family: v.$font-title;
  font-size: 1.8rem;
  color: v.$color-green-dark;
  margin: 0;
}

.close-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #b3cda5;
  border-radius: 8px;
  background: #e7f2de;
  color: #3f5648;
  font-size: 1.2rem;
  cursor: pointer;
  display: grid;
  place-items: center;

  &:hover {
    background: #ffd9bf;
    color: #734531;
  }
}

.pet-summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  padding: 14px;
  background: #e8f2df;
  margin: 16px 24px 0;
  border-radius: 12px;
  border: 1px solid #bfd6b2;
  align-items: center;
}

.pet-image {
  width: 88px;
  height: 88px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #aac39d;
}

.pet-info {
  h3 {
    font-family: v.$font-title;
    color: v.$color-green-dark;
    margin: 0 0 4px;
    font-size: 1.3rem;
  }

  p {
    font-family: v.$font-subtitle;
    color: #42544a;
    margin: 0;
  }
}

.adoption-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-family: v.$font-subtitle;
  font-weight: v.$weight-bold;
  color: v.$color-green-dark;
  margin-bottom: 8px;
}

.form-textarea {
  width: 100%;
  min-height: 130px;
  padding: 14px;
  border: 1px solid #9fbc91;
  border-radius: 10px;
  background: #f2f8ec;
  font-family: v.$font-subtitle;
  font-size: 1rem;
  resize: vertical;
  box-sizing: border-box;
  color: #2c4134;

  &:focus {
    outline: none;
    border-color: v.$color-peach-dark;
    box-shadow: 0 0 0 3px rgba(231, 111, 81, 0.18);
  }
}

.form-help {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #4e6054;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;

  :deep(.btn) {
    border: none;
    min-width: 0;
    font-size: 1rem;
    padding: 10px 16px;
  }

  :deep(button:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

@media (max-width: 640px) {
  .modal-content {
    max-height: 95vh;
  }

  .modal-header {
    padding: 18px 18px 14px;
  }

  .modal-title {
    font-size: 1.45rem;
    max-width: 80%;
  }

  .pet-summary {
    margin: 14px 18px 0;
    gap: 12px;
  }

  .pet-image {
    width: 72px;
    height: 72px;
  }

  .adoption-form {
    padding: 18px;
  }

  .form-actions {
    justify-content: center;
  }
}
</style>
