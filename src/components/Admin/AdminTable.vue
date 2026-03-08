<script setup lang="ts">
import type { AdminColumn } from '@/config/adminConfig';

defineProps<{
  columns: AdminColumn[];
  items: Record<string, any>[];
  idField: string;
  showEdit?: boolean;
  showDelete?: boolean;
}>();

const emit = defineEmits<{
  (e: 'edit', item: Record<string, any>): void;
  (e: 'delete', item: Record<string, any>): void;
}>();

const formatValue = (value: any) => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';

  if (typeof value === 'string' && value.includes('T')) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toLocaleString('es-ES');
  }

  return value;
};
</script>

<template>
  <table class="admin-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        <th>Acciones</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="item in items" :key="item[idField]">
        <td v-for="col in columns" :key="col.key">
          <img
            v-if="col.key === 'photo_url' && item[col.key]"
            :src="item[col.key]"
            alt="Foto mascota"
            class="photo-round"
          >
          <span v-else>{{ formatValue(item[col.key]) }}</span>
        </td>
        <td class="actions">
          <button v-if="showEdit" class="btn-edit" @click="emit('edit', item)">Editar</button>
          <button v-if="showDelete" class="btn-delete" @click="emit('delete', item)">Eliminar</button>
          <span v-if="!showEdit && !showDelete">-</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.admin-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;

  th,
  td {
    font-family: v.$font-subtitle;
    padding: 10px;
    border-bottom: 1px solid #ececec;
    text-align: left;
  }

  th {
    color: #475569;
    background: #f8fafc;
  }
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.photo-round {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #d1d5db;
}

.btn-edit,
.btn-delete {
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-family: v.$font-subtitle;
  font-weight: v.$weight-bold;
}

@media (max-width: 768px) {
  .admin-table {
    min-width: 680px;
  }

  .btn-edit,
  .btn-delete {
    padding: 6px 10px;
    font-size: 0.9rem;
  }
}

.btn-edit {
  background: #dbeafe;
  color: #1d4ed8;
}

.btn-delete {
  background: #fee2e2;
  color: #b91c1c;
}
</style>
