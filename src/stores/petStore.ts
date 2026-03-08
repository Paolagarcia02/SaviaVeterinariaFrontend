import { defineStore } from 'pinia';
import { publicApi } from '@/api/axios';
import type { Pet } from '../models/type';

const normalizeText = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const normalizePetStatus = (status: string): Pet['status'] => {
  const normalized = normalizeText(status);
  if (normalized === 'en adopcion') return 'En Adopción';
  if (normalized === 'adoptado') return 'Adoptado';
  return 'Con Dueño';
};

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

      const candidates = state.pets.filter((pet) => pet.status === 'En Adopción');

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
        // El catálogo público no debe depender del token de sesión.
        const response = await publicApi.get('/Pet');
        this.pets = (response.data as Pet[]).map((pet) => ({
          ...pet,
          status: normalizePetStatus(pet.status)
        }));
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});
