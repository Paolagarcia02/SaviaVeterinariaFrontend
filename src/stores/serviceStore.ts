import { defineStore } from 'pinia';
import api from '@/api/axios';

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
        const response = await api.get('/Service');
        this.services = response.data;
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});
