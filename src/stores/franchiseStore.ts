import { defineStore } from 'pinia';
import api from '@/api/axios';

export interface Franchise {
  franchise_id: number;
  name: string;
  address: string;
  phone: string;
  created_at: string;
}

export const useFranchiseStore = defineStore('franchiseStore', {
  state: () => ({
    franchises: [] as Franchise[],
    loading: false
  }),

  actions: {
    async fetchFranchises() {
      this.loading = true;
      try {
        const response = await api.get('/Franchise');
        this.franchises = response.data;
      } catch (error) {
        console.error('Error fetching franchises:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});