<script setup lang="ts">
import type { AdoptionApplication } from '@/models/type';

defineProps<{
  show: boolean;
  application: AdoptionApplication | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <Teleport to="body">
    <div v-if="show && application" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Detalle de Solicitud</h3>
          <button class="close-btn" @click="emit('close')">✕</button>
        </div>

        <div class="detail-item">
          <strong>ID Solicitud:</strong> {{ application.application_id }}
        </div>
        <div class="detail-item">
          <strong>Mascota:</strong> {{ application.pet_name || `Mascota #${application.pet_id}` }}
        </div>
        <div class="detail-item">
          <strong>Estado:</strong> {{ application.status }}
        </div>
        <div class="detail-item">
          <strong>Fecha:</strong> {{ new Date(application.application_date).toLocaleString('es-ES') }}
        </div>
        <div class="detail-item">
          <strong>Mensaje:</strong>
          <p>{{ application.message }}</p>
        </div>

        <div class="modal-actions">
          <button class="btn" @click="emit('close')">Cerrar</button>
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
  max-width: 620px;
  background: white;
  border-radius: 12px;
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.close-btn {
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.detail-item {
  font-family: v.$font-subtitle;
  color: v.$color-green-dark;
  margin-bottom: 12px;

  p {
    margin-top: 6px;
    background: #f7f7f7;
    border-radius: 8px;
    padding: 12px;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  background: v.$color-peach-medium;
  color: v.$color-green-dark;
  font-family: v.$font-subtitle;
  font-weight: v.$weight-bold;
}
</style>
