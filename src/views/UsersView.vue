<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/authStore';
import { useUserPanelStore } from '@/stores/userPanelStore';
import { publicApi } from '@/api/axios';
import AdminSidebar from '@/components/Admin/AdminSidebar.vue';
import UserPetFormModal from '@/components/UserPanel/UserPetFormModal.vue';
import ApplicationDetailModal from '@/components/UserPanel/ApplicationDetailModal.vue';
import UserPetRow from '@/components/UserPanel/UserPetRow.vue';
import type { Pet, AdoptionApplication, User } from '@/models/type';

type UserPetUpdatePayload = {
  pet_id: number;
  name?: string;
  species?: string;
  breed?: string;
  birth_date?: string;
  description?: string;
  status?: Pet['status'];
  photo_url?: string | null;
};

const router = useRouter();
const authStore = useAuthStore();
const userPanelStore = useUserPanelStore();

const currentTab = ref('dashboard');

const showPetModal = ref(false);
const editingPet = ref<Pet | null>(null);

const showApplicationModal = ref(false);
const selectedApplication = ref<AdoptionApplication | null>(null);

const expandedAppointmentId = ref<number | null>(null);
const publicPetNamesById = ref<Record<number, string>>({});

const profileForm = ref({
  full_name: '',
  email: '',
  password: '',
  role: 'User' as User['role'],
  franchise_id: 0
});

const appointmentList = computed(() => {
  return [...userPanelStore.appointments].sort((a, b) => {
    const bTime = b.date_time ? new Date(b.date_time).getTime() : 0;
    const aTime = a.date_time ? new Date(a.date_time).getTime() : 0;
    return bTime - aTime;
  });
});

const loadPanel = async () => {
  try {
    await Promise.all([
      userPanelStore.fetchAll(authStore.userId),
      loadPublicPetNames()
    ]);

    if (userPanelStore.profile) {
      profileForm.value.full_name = userPanelStore.profile.full_name;
      profileForm.value.email = userPanelStore.profile.email;
      profileForm.value.role = userPanelStore.profile.role;
      profileForm.value.franchise_id = userPanelStore.profile.franchise_id || 0;
      profileForm.value.password = '';
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar tu panel.'
    });
  }
};

const loadPublicPetNames = async () => {
  try {
    const response = await publicApi.get('/Pet');
    const list = Array.isArray(response.data) ? response.data : [];
    publicPetNamesById.value = list.reduce((acc: Record<number, string>, pet: any) => {
      const petId = Number(pet?.pet_id);
      const name = typeof pet?.name === 'string' ? pet.name.trim() : '';
      if (Number.isFinite(petId) && name) {
        acc[petId] = name;
      }
      return acc;
    }, {});
  } catch {
    publicPetNamesById.value = {};
  }
};

onMounted(async () => {
  if (!authStore.isLogged) {
    router.push('/auth/login');
    return;
  }

  if (authStore.canAccessAdmin) {
    router.push('/admin');
    return;
  }

  await loadPanel();
});

const openPetModal = (pet: Pet) => {
  editingPet.value = pet;
  showPetModal.value = true;
};

const closePetModal = () => {
  editingPet.value = null;
  showPetModal.value = false;
};

const savePet = async (petData: UserPetUpdatePayload) => {
  try {
    await userPanelStore.updatePet(petData);
    await userPanelStore.fetchPets();

    Swal.fire({
      icon: 'success',
      title: 'Mascota actualizada'
    });

    closePetModal();
  } catch (error: any) {
    const backendData = error?.response?.data;
    const backendMessage =
      backendData?.message ||
      backendData?.title ||
      (typeof backendData === 'string' ? backendData : '');

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: backendMessage || 'No se pudo actualizar la mascota.'
    });
  }
};

const deletePet = async (pet: Pet) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: `¿Eliminar a ${pet.name}?`,
    text: 'Esta acción no se puede deshacer.',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    await userPanelStore.deletePet(pet.pet_id);
    await userPanelStore.fetchPets();

    Swal.fire({
      icon: 'success',
      title: 'Mascota eliminada'
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar la mascota.'
    });
  }
};

const getApplicationPetName = (application: AdoptionApplication) => {
  const directName =
    (application as any).pet_name ||
    (application as any).petName ||
    (application as any).Pet_name ||
    (application as any).PetName;

  if (typeof directName === 'string' && directName.trim()) {
    return directName.trim();
  }

  const pet = userPanelStore.pets.find((item) => item.pet_id === application.pet_id);
  if (pet) return pet.name;

  const publicName = publicPetNamesById.value[application.pet_id];
  return publicName || `Mascota #${application.pet_id}`;
};

const openApplicationDetail = (application: AdoptionApplication) => {
  selectedApplication.value = {
    ...application,
    pet_name: getApplicationPetName(application)
  };
  showApplicationModal.value = true;
};

const closeApplicationModal = () => {
  selectedApplication.value = null;
  showApplicationModal.value = false;
};

const saveProfile = async () => {
  try {
    const payload: Partial<User> = {
      full_name: profileForm.value.full_name,
      email: profileForm.value.email
    };

    if (profileForm.value.password.trim()) {
      payload.password = profileForm.value.password;
    }

    await userPanelStore.updateProfile(payload, authStore.userId);
    await userPanelStore.fetchProfile(authStore.userId);

    Swal.fire({
      icon: 'success',
      title: 'Perfil actualizado'
    });

    profileForm.value.password = '';
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar tu perfil.'
    });
  }
};

const toggleAppointmentDetails = (appointmentId: number) => {
  expandedAppointmentId.value = expandedAppointmentId.value === appointmentId ? null : appointmentId;
};

const getPetName = (petId: number) => {
  const pet = userPanelStore.pets.find((item) => item.pet_id === petId);
  return pet ? pet.name : `Mascota #${petId}`;
};

const getLabTestsForAppointment = (appointmentId: number) => {
  return userPanelStore.labTests.filter((test) => test.appointment_id === appointmentId);
};

const formatAppointmentDateTime = (value?: string | null) => {
  if (!value) return 'Pendiente de asignar';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Pendiente de asignar';
  return date.toLocaleString('es-ES');
};

</script>

<template>
  <div class="panel-layout">
    <AdminSidebar :activeTab="currentTab" :isUserPanel="true" @changeTab="(tab: string) => currentTab = tab" />

    <main class="panel-content">
      <div v-if="userPanelStore.loading" class="loading">Cargando tu panel...</div>

      <template v-else>
        <section v-if="currentTab === 'dashboard'" class="panel-section">
          <h1>Mi Panel</h1>
          <div class="stats-grid">
            <article class="stat-card">
              <h3>Mis Mascotas</h3>
              <p>{{ userPanelStore.pets.length }}</p>
            </article>
            <article class="stat-card">
              <h3>Solicitudes</h3>
              <p>{{ userPanelStore.applications.length }}</p>
            </article>
            <article class="stat-card">
              <h3>Mis Citas</h3>
              <p>{{ userPanelStore.appointments.length }}</p>
            </article>
            <article class="stat-card">
              <h3>Lab Tests</h3>
              <p>{{ userPanelStore.labTests.length }}</p>
            </article>
          </div>
        </section>

        <section v-if="currentTab === 'pets'" class="panel-section">
          <h1>Mis Mascotas</h1>
          <div v-if="userPanelStore.pets.length === 0" class="empty-state">
            No tienes mascotas registradas.
          </div>
          <div v-else class="table-wrapper">
            <table class="panel-table panel-table--pets">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Especie</th>
                  <th>Raza</th>
                  <th>Estado</th>
                  <th>Nacimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <UserPetRow
                  v-for="pet in userPanelStore.pets"
                  :key="pet.pet_id"
                  :pet="pet"
                  @edit="openPetModal"
                  @delete="deletePet"
                />
              </tbody>
            </table>
          </div>
        </section>

        <section v-if="currentTab === 'applications'" class="panel-section">
          <h1>Mis Solicitudes</h1>
          <div class="table-wrapper">
            <table class="panel-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mascota</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="application in userPanelStore.applications" :key="application.application_id">
                  <td>{{ application.application_id }}</td>
                  <td>{{ getApplicationPetName(application) }}</td>
                  <td>{{ application.status }}</td>
                  <td>{{ new Date(application.application_date).toLocaleDateString('es-ES') }}</td>
                  <td>
                    <button class="btn-small btn-view" @click="openApplicationDetail(application)">Abrir</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-if="currentTab === 'appointments'" class="panel-section">
          <h1>Mis Citas y Lab Tests</h1>
          <div class="table-wrapper">
            <table class="panel-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Mascota</th>
                  <th>Estado</th>
                  <th>Motivo</th>
                  <th>Lab Tests</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="appointment in appointmentList" :key="appointment.appointment_id">
                  <tr>
                    <td>{{ formatAppointmentDateTime(appointment.date_time) }}</td>
                    <td>{{ getPetName(appointment.pet_id) }}</td>
                    <td>{{ appointment.status }}</td>
                    <td>{{ appointment.reason }}</td>
                    <td>
                      <button class="btn-small btn-view" @click="toggleAppointmentDetails(appointment.appointment_id)">
                        Ver ({{ getLabTestsForAppointment(appointment.appointment_id).length }})
                      </button>
                    </td>
                  </tr>
                  <tr v-if="expandedAppointmentId === appointment.appointment_id">
                    <td colspan="5" class="labs-cell">
                      <div v-if="getLabTestsForAppointment(appointment.appointment_id).length === 0">
                        No hay lab tests para esta cita.
                      </div>
                      <ul v-else class="labs-list">
                        <li v-for="test in getLabTestsForAppointment(appointment.appointment_id)" :key="test.test_id">
                          <strong>{{ test.test_type }}</strong> - {{ test.status }}
                          <span v-if="test.comments"> | {{ test.comments }}</span>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </section>

        <section v-if="currentTab === 'profile'" class="panel-section">
          <h1>Mi Perfil</h1>
          <form class="profile-form" @submit.prevent="saveProfile">
            <div class="form-group">
              <label>Nombre completo</label>
              <input v-model="profileForm.full_name" type="text" required>
            </div>

            <div class="form-group">
              <label>Email</label>
              <input v-model="profileForm.email" type="email" required>
            </div>

            <div class="form-group">
              <label>Nueva contraseña (opcional)</label>
              <input v-model="profileForm.password" type="password">
            </div>

            <button type="submit" class="save-btn">Guardar cambios</button>
          </form>
        </section>
      </template>
    </main>

    <UserPetFormModal
      :show="showPetModal"
      :pet="editingPet"
      @close="closePetModal"
      @save="savePet"
    />

    <ApplicationDetailModal
      :show="showApplicationModal"
      :application="selectedApplication"
      @close="closeApplicationModal"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.panel-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #f5f7f9;
}

.panel-content {
  flex: 1;
  padding: 20px;
  background: #f5f7f9;
  overflow-x: auto;

  @media (min-width: 768px) {
    padding: 30px;
  }
}

.panel-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 20px;
  margin-bottom: 20px;
}

.panel-section h1 {
  font-family: v.$font-title;
  color: v.$color-green-dark;
  margin-bottom: 16px;
  font-size: 2rem;
}

.loading {
  font-family: v.$font-subtitle;
  color: v.$color-green-dark;
}

.stats-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e8ecef;
  padding: 20px;

  h3 {
    font-family: v.$font-subtitle;
    color: v.$color-green-dark;
    margin-bottom: 10px;
  }

  p {
    font-family: v.$font-title;
    font-size: 2rem;
    color: v.$color-peach-dark;
    margin: 0;
  }
}

.table-wrapper {
  background: #fff;
  border-radius: 10px;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
}

.panel-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #eee;
    font-family: v.$font-subtitle;
    color: #1f2937;
    text-align: left;
  }

  th {
    background: #f8fafc;
    color: #334155;
    font-weight: 700;
  }
}

.panel-table--pets th,
.panel-table--pets td {
  vertical-align: middle;
}

.panel-table--pets th:nth-child(1),
.panel-table--pets td:nth-child(1) {
  width: 84px;
}

.panel-table--pets td:nth-child(2) {
  font-weight: 700;
}

.panel-table--pets th:last-child,
.panel-table--pets td:last-child {
  width: 180px;
}

@media (max-width: 768px) {
  .panel-table--pets {
    min-width: 760px;
  }
}

.pet-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.pet-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.pet-card__image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #d1d5db;
}

.pet-card__name {
  font-family: v.$font-title;
  color: v.$color-green-dark;
  font-size: 1.5rem;
  margin: 0 0 8px;
}

.pet-card__body {
  width: 100%;
}

.pet-card__line {
  margin: 0 0 6px;
  font-family: v.$font-subtitle;
  color: #1f2937;
}

.pet-card__actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  font-family: v.$font-subtitle;
  color: #4b5563;
  background: #fff;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  padding: 18px;
}

.btn-small {
  border: none;
  border-radius: 6px;
  padding: 8px 10px;
  font-family: v.$font-subtitle;
  font-weight: v.$weight-bold;
  cursor: pointer;
}

.btn-view {
  background: #dbeafe;
  color: #1d4ed8;
}

.labs-cell {
  background: #f8fafc;
}

.labs-list {
  margin: 0;
  padding-left: 18px;

  li {
    list-style: disc;
    margin-bottom: 8px;
    font-family: v.$font-subtitle;
  }
}

.profile-form {
  max-width: 680px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;

  label {
    font-family: v.$font-subtitle;
    font-weight: v.$weight-bold;
    color: v.$color-green-dark;
    margin-bottom: 6px;
  }

  input,
  select {
    border: 2px solid v.$color-green-medium;
    border-radius: 8px;
    padding: 10px;
    font-family: v.$font-subtitle;
  }
}

.save-btn {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  background: v.$color-peach-medium;
  color: v.$color-green-dark;
  font-family: v.$font-subtitle;
  font-weight: v.$weight-bold;
}
</style>
