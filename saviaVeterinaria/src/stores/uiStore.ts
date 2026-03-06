import { defineStore } from 'pinia';
import { ref } from 'vue';

// Store para manejar el estado de la interfaz de usuario (UI)
export const useUiStore = defineStore('ui', () => {
    // Estado de carga global de la aplicación
    const isLoading = ref(false);
    // Control de visibilidad del modal
    const showModal = ref(false);
    // Datos que se pasarán al modal
    const modalData = ref<any>(null);

    // Función para abrir el modal con datos opcionales
    function openModal(data?: any) {
        modalData.value = data;
        showModal.value = true;
    }

    // Función para cerrar el modal y limpiar los datos
    function closeModal() {
        showModal.value = false;
        modalData.value = null;
    }

    // Función para cambiar el estado de carga
    function setLoading(value: boolean) {
        isLoading.value = value;
    }

    return { 
        isLoading, 
        showModal, 
        modalData, 
        openModal, 
        closeModal, 
        setLoading 
    };
});
