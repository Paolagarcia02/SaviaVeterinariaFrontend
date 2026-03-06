<script setup lang="ts">
/**
 * Componente PetFormModal
 * Modal para crear o editar mascotas en el panel de administración
 * Incluye validación de formulario con Yup
 */
import { ref, watch } from 'vue';
import type { Pet } from '@/models/type';
import * as yup from 'yup';

// Props: recibe si el modal está visible y la mascota a editar (opcional)
const props = defineProps<{
    show: boolean;
    pet?: Pet | null;
}>();

// Emits: emite eventos para cerrar el modal o guardar los datos
const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', pet: Partial<Pet>): void;
}>();

// Estado del formulario con todos los campos de la mascota
const formData = ref<{
    name: string;
    species: string;
    breed: string;
    birth_date: string;
    photo_url: string;
    description: string;
    status: Pet['status'];
}>({
    name: '',
    species: '',
    breed: '',
    birth_date: '',
    photo_url: '',
    description: '',
    status: 'En Adopción'
});

// Objeto para almacenar los errores de validación
const errors = ref<Record<string, string>>({});

// Función para resetear el formulario a sus valores iniciales
const resetForm = () => {
    formData.value = {
        name: '',
        species: '',
        breed: '',
        birth_date: '',
        photo_url: '',
        description: '',
        status: 'En Adopción'
    };
    errors.value = {};
};

// Esquema de validación con Yup
const petSchema = yup.object({
    name: yup.string().required('El nombre es obligatorio').min(2, 'Mínimo 2 caracteres'),
    species: yup.string().required('La especie es obligatoria'),
    breed: yup.string().nullable(),
    birth_date: yup.date().required('La fecha de nacimiento es obligatoria').max(new Date(), 'La fecha no puede ser futura'),
    photo_url: yup.string().url('Debe ser una URL válida').required('La foto es obligatoria'),
    description: yup.string().max(500, 'Máximo 500 caracteres'),
    status: yup.string().oneOf(['Con Dueño', 'En Adopción', 'Adoptado']).required()
});

// Watcher: cuando cambia la prop 'pet', actualizamos el formulario
watch(() => props.pet, (newPet) => {
    if (newPet) {
        // Si hay una mascota, rellenamos el formulario con sus datos
        const birthDate = newPet.birth_date || '';
        const dateOnly = birthDate.includes('T') ? birthDate.split('T')[0]! : birthDate;
        formData.value = {
            name: newPet.name,
            species: newPet.species,
            breed: newPet.breed ?? '',
            birth_date: dateOnly,
            photo_url: newPet.photo_url,
            description: newPet.description ?? '',
            status: newPet.status
        };
    } else {
        // Si no hay mascota, reseteamos el formulario
        resetForm();
    }
}, { immediate: true });

// Función que maneja el envío del formulario
const handleSubmit = async () => {
    try {
        // Validamos los datos con Yup
        await petSchema.validate(formData.value, { abortEarly: false });
        errors.value = {};
        
        // Preparamos los datos para enviar
        const dataToSend = { ...formData.value };
        if (props.pet) {
            // Si estamos editando, añadimos el ID
            (dataToSend as any).pet_id = props.pet.pet_id;
        }
        
        // Emitimos el evento save con los datos
        emit('save', dataToSend);
        resetForm();
    } catch (err: any) {
        // Si hay errores de validación, los mostramos
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error: any) => {
            validationErrors[error.path] = error.message;
        });
        errors.value = validationErrors;
    }
};

// Función para cerrar el modal
const handleClose = () => {
    resetForm();
    emit('close');
};
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="show" class="modal-overlay" @click.self="handleClose">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>{{ pet ? 'Editar Mascota' : 'Nueva Mascota' }}</h2>
                        <button @click="handleClose" class="close-btn">✕</button>
                    </div>

                    <form @submit.prevent="handleSubmit" class="modal-form">
                        <div class="form-group">
                            <label>Nombre *</label>
                            <input v-model="formData.name" type="text" :class="{ error: errors.name }">
                            <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Especie *</label>
                                <select v-model="formData.species" :class="{ error: errors.species }">
                                    <option value="">Seleccionar</option>
                                    <option value="Perro">Perro</option>
                                    <option value="Gato">Gato</option>
                                    <option value="Conejo">Conejo</option>
                                    <option value="Ave">Ave</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                <span v-if="errors.species" class="error-msg">{{ errors.species }}</span>
                            </div>

                            <div class="form-group">
                                <label>Raza</label>
                                <input v-model="formData.breed" type="text">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Fecha de Nacimiento *</label>
                                <input v-model="formData.birth_date" type="date" :class="{ error: errors.birth_date }">
                                <span v-if="errors.birth_date" class="error-msg">{{ errors.birth_date }}</span>
                            </div>

                            <div class="form-group">
                                <label>Estado *</label>
                                <select v-model="formData.status">
                                    <option value="En Adopción">En Adopción</option>
                                    <option value="Adoptado">Adoptado</option>
                                    <option value="Con Dueño">Con Dueño</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>URL de la Foto *</label>
                            <input v-model="formData.photo_url" type="url" :class="{ error: errors.photo_url }">
                            <span v-if="errors.photo_url" class="error-msg">{{ errors.photo_url }}</span>
                        </div>

                        <div class="form-group">
                            <label>Descripción</label>
                            <textarea v-model="formData.description" rows="4" :class="{ error: errors.description }"></textarea>
                            <span v-if="errors.description" class="error-msg">{{ errors.description }}</span>
                        </div>

                        <div class="modal-actions">
                            <button type="button" @click="handleClose" class="btn btn-cancel">Cancelar</button>
                            <button type="submit" class="btn btn-save">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 30px;
    border-bottom: 2px solid v.$color-green-light;

    h2 {
        font-family: v.$font-title;
        color: v.$color-green-dark;
        margin: 0;
    }
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    color: #999;
    transition: color 0.3s;

    &:hover {
        color: v.$color-peach-dark;
    }
}

.modal-form {
    padding: 30px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;

    @media (min-width: 600px) {
        grid-template-columns: 1fr 1fr;
    }
}

.form-group {
    margin-bottom: 20px;

    label {
        display: block;
        font-family: v.$font-subtitle;
        font-weight: bold;
        color: v.$color-green-dark;
        margin-bottom: 8px;
    }

    input, select, textarea {
        width: 100%;
        padding: 10px 15px;
        border: 2px solid v.$color-green-light;
        border-radius: 8px;
        font-family: v.$font-subtitle;
        font-size: 1rem;
        transition: border-color 0.3s;
        box-sizing: border-box;

        &:focus {
            outline: none;
            border-color: v.$color-peach-dark;
        }

        &.error {
            border-color: #e74c3c;
        }
    }

    textarea {
        resize: vertical;
    }
}

.error-msg {
    display: block;
    color: #e74c3c;
    font-size: 0.85rem;
    margin-top: 5px;
    font-family: v.$font-subtitle;
}

.modal-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 30px;
}

.btn {
    padding: 12px 30px;
    border: none;
    border-radius: 8px;
    font-family: v.$font-title;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cancel {
    background: #e0e0e0;
    color: #555;

    &:hover {
        background: #d0d0d0;
    }
}

.btn-save {
    background: v.$color-peach-dark;
    color: white;

    &:hover {
        background: v.$color-green-dark;
    }
}

.modal-enter-active, .modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
    opacity: 0;
}
</style>
