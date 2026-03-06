<script setup lang="ts">
/**
 * Componente UserFormModal
 * Modal para crear o editar usuarios en el panel de administración
 * Incluye validación de formulario con Yup
 */
import { ref, watch } from 'vue';
import type { User } from '@/models/type';
import * as yup from 'yup';

// Props: recibe si el modal está visible y el usuario a editar (opcional)
const props = defineProps<{
    show: boolean;
    user?: User | null;
}>();

// Emits: emite eventos para cerrar el modal o guardar los datos
const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', user: Partial<User>): void;
}>();

// Estado del formulario con todos los campos del usuario
const formData = ref({
    full_name: '',
    email: '',
    password: '',
    role: 'User' as 'Admin' | 'Vet' | 'User'
});

// Objeto para almacenar los errores de validación
const errors = ref<Record<string, string>>({});

// Función para resetear el formulario a sus valores iniciales
const resetForm = () => {
    formData.value = {
        full_name: '',
        email: '',
        password: '',
        role: 'User'
    };
    errors.value = {};
};

// Esquema de validación con Yup
// La contraseña solo es obligatoria al crear, no al editar
const userSchema = yup.object({
    full_name: yup.string().required('El nombre es obligatorio').min(3, 'Mínimo 3 caracteres'),
    email: yup.string().email('Email inválido').required('El email es obligatorio'),
    password: yup.string().when('$isEdit', {
        is: false,
        then: (schema) => schema.required('La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
        otherwise: (schema) => schema.notRequired()
    }),
    role: yup.string().oneOf(['Admin', 'Vet', 'User']).required()
});

// Watcher: cuando cambia la prop 'user', actualizamos el formulario
watch(() => props.user, (newUser) => {
    if (newUser) {
        // Si hay un usuario, rellenamos el formulario con sus datos
        formData.value = {
            full_name: newUser.full_name,
            email: newUser.email,
            password: '', // La contraseña se deja vacía al editar
            role: newUser.role
        };
    } else {
        // Si no hay usuario, reseteamos el formulario
        resetForm();
    }
}, { immediate: true });

// Función que maneja el envío del formulario
const handleSubmit = async () => {
    try {
        // Validamos los datos con Yup
        await userSchema.validate(formData.value, { 
            abortEarly: false,
            context: { isEdit: !!props.user } // Indicamos si estamos editando
        });
        errors.value = {};
        
        // Preparamos los datos para enviar
        const dataToSend: any = { ...formData.value };
        if (props.user) {
            // Si estamos editando, añadimos el ID
            dataToSend.user_id = props.user.user_id;
            // Si no se cambió la contraseña, la eliminamos del objeto
            if (!dataToSend.password) delete dataToSend.password;
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
                        <h2>{{ user ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
                        <button @click="handleClose" class="close-btn">✕</button>
                    </div>

                    <form @submit.prevent="handleSubmit" class="modal-form">
                        <div class="form-group">
                            <label>Nombre Completo *</label>
                            <input v-model="formData.full_name" type="text" :class="{ error: errors.full_name }">
                            <span v-if="errors.full_name" class="error-msg">{{ errors.full_name }}</span>
                        </div>

                        <div class="form-group">
                            <label>Email *</label>
                            <input v-model="formData.email" type="email" :class="{ error: errors.email }">
                            <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
                        </div>

                        <div class="form-group">
                            <label>{{ user ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña *' }}</label>
                            <input v-model="formData.password" type="password" :class="{ error: errors.password }">
                            <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
                        </div>

                        <div class="form-group">
                            <label>Rol *</label>
                            <select v-model="formData.role">
                                <option value="User">Usuario</option>
                                <option value="Vet">Veterinario</option>
                                <option value="Admin">Administrador</option>
                            </select>
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
    max-width: 500px;
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

.form-group {
    margin-bottom: 20px;

    label {
        display: block;
        font-family: v.$font-subtitle;
        font-weight: bold;
        color: v.$color-green-dark;
        margin-bottom: 8px;
    }

    input, select {
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
