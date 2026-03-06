<script setup lang="ts">
/**
 * Componente AdminUserRow
 * Fila de la tabla de usuarios en el panel de administración
 * Muestra la información de un usuario y botones de acción
 */
import type { User } from '@/models/type';

// Props: recibe los datos del usuario
defineProps<{
    user: User
}>();

// Emits: emite eventos para eliminar o cambiar el rol del usuario
const emit = defineEmits<{
    (e: 'delete', id: number, name: string): void;
    (e: 'edit', user: User): void;
}>();
</script>

<template>
    <tr class="admin-row">
        <td>{{ user.user_id }}</td>
        <td><strong>{{ user.full_name }}</strong></td>
        <td>{{ user.email }}</td>
        <td>
            <span :class="['role-badge', user.role.toLowerCase()]">
                {{ user.role }}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button @click="emit('edit', user)" class="btn-icon" title="Editar">✏️</button>
                <button @click="emit('delete', user.user_id, user.full_name)" class="btn-icon btn-icon--delete" title="Eliminar Usuario">🗑️</button>
            </div>
        </td>
    </tr>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.role-badge {
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;

    &.admin { background-color: #fce4ec; color: #d81b60; }
    &.vet { background-color: #e8eaf6; color: #3f51b5; }
    &.user { background-color: #eeeeee; color: #616161; }
}

.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    &:hover { transform: scale(1.1); }
    &--delete { filter: saturate(0.5); }
}
</style>