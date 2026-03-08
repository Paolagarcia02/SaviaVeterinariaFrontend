import { defineStore } from 'pinia';
import api from '@/api/axios';
import type { Pet } from '../models/type';

// Store para manejar las mascotas
export const usePetStore = defineStore('petStore', {
  state: () => ({
    pets: [] as Pet[], 
    loading: false 
  }),

  getters: {
    // Getter: devuelve 3 mascotas aleatorias en adopción para el carrusel
    randomAdoptions: (state): Pet[] => {
      if (state.pets.length === 0) return [];

      const candidates = state.pets.filter(pet => pet.status === 'En Adopción');

      return [...candidates]
        .sort(() => Math.random() - 0.5) // Mezcla aleatoria
        .slice(0, 3) // Toma solo 3
    }
  },

  actions: {
    // Action: obtiene todas las mascotas desde el backend
    async fetchPets() {
      this.loading = true;
      try {
        const response = await api.get('/Pet');
        this.pets = response.data;
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});