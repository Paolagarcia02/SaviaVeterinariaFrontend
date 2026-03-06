<script setup lang="ts">
/**
 * Componente AdminPetRow
 * Fila de la tabla de mascotas en el panel de administración
 * Muestra la información de una mascota y botones de acción (editar/eliminar)
 */
import type { Pet } from '@/models/type'; 

// Props: recibe los datos de la mascota
defineProps<{
    pet: Pet 
}>();

// Emits: emite eventos para editar o eliminar la mascota
const emit = defineEmits<{
    (e: 'delete', id: number, name: string): void;
    (e: 'edit', pet: Pet): void;
}>();

// Función para normalizar el estado (quitar acentos y espacios para CSS)
const normalizeStatus = (status: string) => {
    return status
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
        .replace(/ /g, '-');              // Reemplaza espacios por guiones
};
</script>

<template>
    <tr class="admin-row">
        <td><img :src="pet.photo_url" class="thumbnail" :alt="pet.name"></td>
        <td><strong>{{ pet.name }}</strong></td>
        <td>{{ pet.species }}</td>
        <td>
            <span :class="['status-badge', normalizeStatus(pet.status)]">
                {{ pet.status }}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button @click="emit('edit', pet)" class="btn-icon" title="Editar">✏️</button>
                <button @click="emit('delete', pet.pet_id, pet.name)" class="btn-icon btn-icon--delete" title="Borrar">🗑️</button>
            </div>
        </td>
    </tr>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.thumbnail {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    object-fit: cover;
    border: 2px solid v.$color-green-light;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: bold;
    
    &.con-dueno { background: #e3f2fd; color: #1976d2; }
    &.en-adopcion { background: #fff3e0; color: #f57c00; }
    &.adoptado { background: #e8f5e9; color: #388e3c; }
}

.action-buttons {
    display: flex;
    gap: 10px;
}

.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.3rem;
    transition: transform 0.2s;

    &:hover { transform: scale(1.2); }
    &--delete { filter: grayscale(0.2); }
}
</style>