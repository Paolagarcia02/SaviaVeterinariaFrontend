import { defineStore } from 'pinia';
import api from '@/api/axios';
import type { Pet, AdoptionApplication, Appointment, LabTest, User } from '@/models/type';

type UserPetUpdatePayload = {
  pet_id: number;
  name?: string;
  species?: string;
  breed?: string;
  birth_date?: string;
  description?: string;
  status?: Pet['status'];
  owner_id?: number | null;
  photo_url?: string | null;
};

export const useUserPanelStore = defineStore('userPanelStore', {
  state: () => ({
    pets: [] as Pet[],
    applications: [] as AdoptionApplication[],
    appointments: [] as Appointment[],
    labTests: [] as LabTest[],
    profile: null as User | null,
    loading: false
  }),

  actions: {
    async fetchPets() {
      const response = await api.get('/Pet/user');
      this.pets = response.data;
    },

    async fetchApplications() {
      const response = await api.get('/AdoptionApplication/user');
      this.applications = response.data;
    },

    async fetchAppointments(userId: number) {
      try {
        const response = await api.get('/Appointment/user');
        this.appointments = response.data;
      } catch {
        const response = await api.get(`/Appointment?UserId=${userId}`);
        this.appointments = response.data;
      }
    },

    async fetchLabTests() {
      try {
        const response = await api.get('/LabTest/user');
        this.labTests = response.data;
      } catch {
        this.labTests = [];
      }
    },

    async fetchProfile(userId: number) {
      try {
        const response = await api.get(`/User/${userId}`);
        this.profile = response.data;
      } catch {
        const response = await api.get('/User');
        const user = response.data.find((item: User) => item.user_id === userId);
        this.profile = user || null;
      }
    },

    async updatePet(payload: UserPetUpdatePayload) {
      const body = {
        Pet_id: payload.pet_id,
        pet_id: payload.pet_id,
        Name: payload.name,
        name: payload.name,
        Species: payload.species,
        species: payload.species,
        Breed: payload.breed ?? null,
        breed: payload.breed ?? null,
        Birth_date: payload.birth_date,
        birth_date: payload.birth_date,
        Photo_url: payload.photo_url ?? '',
        photo_url: payload.photo_url ?? '',
        Description: payload.description ?? null,
        description: payload.description ?? null,
        Status: payload.status,
        status: payload.status
      };

      await api.put('/Pet', body, {
        headers: { 'Content-Type': 'application/json' }
      });
    },

    async deletePet(petId: number) {
      await api.delete(`/Pet?IdPet=${petId}`);
    },

    async updateProfile(userData: Partial<User>, userId: number) {
      await api.put('/User', {
        ...userData,
        user_id: userId,
        User_id: userId
      });
    },

    async fetchAll(userId: number) {
      this.loading = true;
      try {
        await Promise.all([
          this.fetchPets(),
          this.fetchApplications(),
          this.fetchAppointments(userId),
          this.fetchProfile(userId)
        ]);

        await this.fetchLabTests();
      } finally {
        this.loading = false;
      }
    }
  }
});
