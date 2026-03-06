import { defineStore } from 'pinia';
import axios from 'axios';

export interface Service {
  service_id: number;
  name: string;
  description: string;
  icon: string;
}

export const useServiceStore = defineStore('serviceStore', {
  state: () => ({
    services: [] as Service[],
    loading: false
  }),

  actions: {
    async fetchServices() {
      this.loading = true;
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8407';
        const response = await axios.get(`${baseURL}/api/Service`);
        this.services = response.data;
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});
