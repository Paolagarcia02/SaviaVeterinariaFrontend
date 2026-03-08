<script setup lang="ts">
import { ref, watch } from 'vue';
import Swal from 'sweetalert2';
import type { Pet } from '@/models/type';
import { uploadImageToCloudinary } from '@/services/cloudinary';

type UserPetUpdatePayload = {
  pet_id: number;
  name: string;
  species: string;
  breed: string;
  birth_date: string;
  description: string;
  status: Pet['status'];
  photo_url?: string | null;
};

const props = defineProps<{
  show: boolean;
  pet: Pet | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', pet: UserPetUpdatePayload): void;
}>();

const formData = ref({
  pet_id: 0,
  name: '',
  species: '',
  breed: '',
  birth_date: '',
  photo_url: '',
  description: '',
  status: 'En Adopción' as Pet['status']
});

const selectedPhotoFile = ref<File | null>(null);
const photoPreview = ref('');
const saving = ref(false);

watch(
  () => props.pet,
  (pet) => {
    if (!pet) return;

    formData.value = {
      pet_id: pet.pet_id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      birth_date: pet.birth_date?.includes('T') ? pet.birth_date.split('T')[0]! : pet.birth_date,
      photo_url: pet.photo_url,
      description: pet.description || '',
      status: pet.status
    };
    selectedPhotoFile.value = null;
    photoPreview.value = pet.photo_url;
  },
  { immediate: true }
);

const handleSave = async () => {
  let finalPhotoUrl = formData.value.photo_url?.trim() || '';

  if (selectedPhotoFile.value) {
    try {
      saving.value = true;
      finalPhotoUrl = await uploadImageToCloudinary(selectedPhotoFile.value);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error subiendo imagen',
        text: error?.message || 'No se pudo subir la imagen a Cloudinary.'
      });
      saving.value = false;
      return;
    }
  }

  if (!finalPhotoUrl) {
    await Swal.fire({
      icon: 'warning',
      title: 'Foto requerida',
      text: 'Debes indicar una URL de foto o subir una imagen.'
    });
    return;
  }

  emit('save', {
    ...formData.value,
    photo_url: finalPhotoUrl
  });
  saving.value = false;
};

const onPhotoFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedPhotoFile.value = target.files?.[0] || null;

  if (selectedPhotoFile.value) {
    photoPreview.value = URL.createObjectURL(selectedPhotoFile.value);
  } else {
    photoPreview.value = formData.value.photo_url;
  }
};
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Editar Mascota</h3>
          <button class="close-btn" @click="emit('close')">✕</button>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="formData.name" type="text">
          </div>

          <div class="form-group">
            <label>Especie</label>
            <input v-model="formData.species" type="text">
          </div>

          <div class="form-group">
            <label>Raza</label>
            <input v-model="formData.breed" type="text">
          </div>

          <div class="form-group">
            <label>Fecha Nacimiento</label>
            <input v-model="formData.birth_date" type="date">
          </div>

          <div class="form-group">
            <label>Nueva Foto</label>
            <input type="file" accept="image/*" @change="onPhotoFileChange">
            <small class="field-help">Si seleccionas archivo, se sube al backend y se guarda la URL devuelta.</small>
          </div>

          <div class="form-group">
            <label>URL de foto</label>
            <input v-model="formData.photo_url" type="url" placeholder="https://...">
          </div>

          <div class="form-group">
            <label>Vista previa</label>
            <img :src="photoPreview || formData.photo_url" :alt="formData.name || 'Mascota'" class="photo-preview">
          </div>

          <div class="form-group">
            <label>Estado</label>
            <select v-model="formData.status">
              <option value="Con Dueño">Con Dueño</option>
              <option value="En Adopción">En Adopción</option>
              <option value="Adoptado">Adoptado</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="formData.description" rows="4"></textarea>
        </div>

        <div class="modal-actions">
          <button class="btn btn--secondary btn--small" @click="emit('close')">Cancelar</button>
          <button class="btn btn--primary btn--small" :disabled="saving" @click="handleSave">
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 760px;
  background: linear-gradient(160deg, #dcecd0 0%, #cfe3c2 100%);
  border: 1px solid #abc49d;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 18px 35px rgba(35, 57, 44, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    font-family: v.$font-title;
    color: v.$color-green-dark;
    font-size: 1.8rem;
    margin: 0;
  }
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;

  label {
    font-family: v.$font-subtitle;
    color: v.$color-green-dark;
    font-weight: v.$weight-bold;
    margin-bottom: 6px;
  }

  input,
  select,
  textarea {
    border: 1px solid #9fbc91;
    border-radius: 8px;
    padding: 10px;
    font-family: v.$font-subtitle;
    background: #f2f8ec;
    color: #2c4134;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: v.$color-peach-dark;
    box-shadow: 0 0 0 3px rgba(231, 111, 81, 0.2);
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  :deep(.btn) {
    border: none;
    min-width: 0;
    text-align: center;
  }

  :deep(button:disabled) {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.photo-preview {
  width: 100%;
  max-width: 160px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #aac39d;
}

.field-help {
  margin-top: 4px;
  font-size: 0.82rem;
  color: #4e6054;
}
</style>
