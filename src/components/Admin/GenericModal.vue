<script setup lang="ts">
import { ref, watch } from 'vue';
import type { AdminField } from '@/config/adminConfig';

const props = defineProps<{
  show: boolean;
  title: string;
  fields: AdminField[];
  data: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: Record<string, any>): void;
}>();

const form = ref<Record<string, any>>({});
const formEl = ref<HTMLFormElement | null>(null);

watch(
  () => [props.show, props.data],
  () => {
    if (!props.show) return;
    form.value = { ...props.data };
  },
  { immediate: true, deep: true }
);

const onFileChange = (event: Event, key: string) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  form.value[key] = file;
};

const save = () => {
  if (formEl.value && !formEl.value.checkValidity()) {
    formEl.value.reportValidity();
    return;
  }

  const payload = { ...form.value };

  props.fields.forEach((field) => {
    if (field.type === 'number') {
      payload[field.key] = Number(payload[field.key]);
    }
    if (field.type === 'checkbox') {
      payload[field.key] = !!payload[field.key];
    }
  });

  emit('save', payload);
};
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <form ref="formEl" class="modal-form" @submit.prevent="save">
        <div class="form-grid">
          <div v-for="field in fields" :key="field.key" :class="['form-group', { 'form-full': field.type === 'textarea' }]">
            <label>{{ field.label }}</label>

            <input
              v-if="!field.type || field.type === 'text' || field.type === 'number' || field.type === 'date' || field.type === 'time' || field.type === 'datetime-local'"
              v-model="form[field.key]"
              :type="field.type || 'text'"
              :required="field.required"
            >

            <input
              v-else-if="field.type === 'file'"
              type="file"
              accept="image/*"
              :required="field.required"
              @change="onFileChange($event, field.key)"
            >

            <textarea v-else-if="field.type === 'textarea'" v-model="form[field.key]" rows="4" :required="field.required"></textarea>

            <select v-else-if="field.type === 'select'" v-model="form[field.key]" :required="field.required">
              <option v-for="option in field.options || []" :key="String(option.value)" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <input v-else-if="field.type === 'checkbox'" v-model="form[field.key]" type="checkbox">
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" type="button" @click="emit('close')">Cancelar</button>
          <button class="btn-primary" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;

  h2 {
    margin: 0;
    font-family: v.$font-title;
    color: v.$color-green-dark;
  }
}

.close-btn {
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
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

  label {
    font-family: v.$font-subtitle;
    color: v.$color-green-dark;
    font-weight: v.$weight-bold;
    margin-bottom: 6px;
  }

  input,
  select,
  textarea {
    border: 2px solid v.$color-green-medium;
    border-radius: 8px;
    padding: 9px;
    font-family: v.$font-subtitle;
  }
}

.form-full {
  grid-column: 1 / -1;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.btn-primary,
.btn-cancel {
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-family: v.$font-subtitle;
  font-weight: v.$weight-bold;
}

.btn-primary {
  background: v.$color-peach-medium;
  color: v.$color-green-dark;
}

.btn-cancel {
  background: #ececec;
}
</style>
