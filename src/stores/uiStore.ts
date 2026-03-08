import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
    const isLoading = ref(false);
    const showModal = ref(false);
    const modalData = ref<Record<string, any> | null>(null);

    function openModal(data?: Record<string, any>) {
        modalData.value = data || null;
        showModal.value = true;
    }

    function closeModal() {
        showModal.value = false;
        modalData.value = null;
    }

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
