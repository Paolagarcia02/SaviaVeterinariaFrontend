import { defineStore } from 'pinia';
import axios from 'axios';

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
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8407';
        const response = await axios.get(`${baseURL}/api/Franchise`);
        this.franchises = response.data;
      } catch (error) {
        console.error('Error fetching franchises:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});