<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/authStore';
import AdminSidebar from '@/components/Admin/AdminSidebar.vue';
import AdminTable from '@/components/Admin/AdminTable.vue';
import GenericModal from '@/components/Admin/GenericModal.vue';
import { adminConfig, type AdminEntityKey, type AdminField } from '@/config/adminConfig';

const router = useRouter();
const authStore = useAuthStore();

const currentTab = ref<AdminEntityKey | 'profile'>('profile');
const loading = ref(false);
const items = ref<Record<string, any>[]>([]);
const usersLookup = ref<Record<string, any>[]>([]);
const petsLookup = ref<Record<string, any>[]>([]);
const franchisesLookup = ref<Record<string, any>[]>([]);
const roomsLookup = ref<Record<string, any>[]>([]);
const appointmentsLookup = ref<Record<string, any>[]>([]);
const clinicSchedulesLookup = ref<Record<string, any>[]>([]);

const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(0);
const formData = ref<Record<string, any>>({});
const searchQuery = ref('');
const filterValue = ref('all');

const profileForm = ref({
  full_name: '',
  email: '',
  password: '',
  role: 'Admin',
  franchise_id: 0
});

const userRoleOptions = ['Admin', 'Vet', 'User'];
const vetAddEditTabs: AdminEntityKey[] = ['pets', 'appointments', 'labTests'];
const dayLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const pick = (obj: Record<string, any>, keys: string[], fallback: any = undefined) => {
  for (const key of keys) {
    if (obj[key] !== undefined) return obj[key];
  }
  return fallback;
};

const isVetPanel = computed(() => authStore.isVet);
const currentFranchiseId = computed(() => Number(authStore.franchiseId || 0));

const canCreate = computed(() => {
  if (!currentConfig.value) return false;
  if (!isVetPanel.value) return true;
  return vetAddEditTabs.includes(currentTab.value as AdminEntityKey);
});

const canEdit = computed(() => {
  if (!currentConfig.value) return false;
  if (!isVetPanel.value) return true;
  return vetAddEditTabs.includes(currentTab.value as AdminEntityKey);
});

const canDelete = computed(() => {
  if (!currentConfig.value) return false;
  if (!isVetPanel.value) return true;
  return false;
});

const currentConfig = computed(() => {
  if (currentTab.value === 'profile') return null;
  return adminConfig[currentTab.value];
});

const usersScopedForVet = computed(() => {
  if (!isVetPanel.value || !currentFranchiseId.value) return usersLookup.value;
  return usersLookup.value.filter((u) => Number(u.franchise_id || 0) === currentFranchiseId.value);
});

const petsScopedForVet = computed(() => {
  if (!isVetPanel.value || !currentFranchiseId.value) return petsLookup.value;
  return petsLookup.value.filter((p) => {
    const owner = usersLookup.value.find((u) => u.user_id === p.owner_id);
    return Number(owner?.franchise_id || 0) === currentFranchiseId.value;
  });
});

const roomsScopedForVet = computed(() => {
  if (!isVetPanel.value || !currentFranchiseId.value) return roomsLookup.value;
  return roomsLookup.value.filter((r) => Number(r.franchise_id || 0) === currentFranchiseId.value);
});

const appointmentsScopedForVet = computed(() => {
  if (!isVetPanel.value || !currentFranchiseId.value) return appointmentsLookup.value;
  return appointmentsLookup.value.filter((a) => Number(a.franchise_id || 0) === currentFranchiseId.value);
});

const searchableTabs: AdminEntityKey[] = ['pets', 'users', 'appointments', 'labTests', 'adoptionApplications'];
const filterableTabs: AdminEntityKey[] = ['pets', 'users', 'appointments', 'labTests', 'adoptionApplications'];

const filterOptionsByTab: Record<AdminEntityKey, { label: string; value: string }[]> = {
  franchises: [],
  services: [],
  clinicRooms: [],
  clinicSchedules: [],
  users: [
    { label: 'Todos los roles', value: 'all' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Vet', value: 'Vet' },
    { label: 'User', value: 'User' }
  ],
  pets: [
    { label: 'Todos los estados', value: 'all' },
    { label: 'Con Dueño', value: 'Con Dueño' },
    { label: 'En Adopción', value: 'En Adopción' },
    { label: 'Adoptado', value: 'Adoptado' }
  ],
  appointments: [
    { label: 'Todos los estados', value: 'all' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Confirmada', value: 'Confirmada' },
    { label: 'Completada', value: 'Completada' },
    { label: 'Cancelada', value: 'Cancelada' }
  ],
  labTests: [
    { label: 'Todos los estados', value: 'all' },
    { label: 'Solicitada', value: 'Solicitada' },
    { label: 'En Proceso', value: 'En Proceso' },
    { label: 'Completada', value: 'Completada' }
  ],
  adoptionApplications: [
    { label: 'Todos los estados', value: 'all' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Aprobada', value: 'Aprobada' },
    { label: 'Rechazada', value: 'Rechazada' }
  ]
};

const canSearchCurrentTab = computed(() => {
  if (currentTab.value === 'profile') return false;
  return searchableTabs.includes(currentTab.value);
});

const canFilterCurrentTab = computed(() => {
  if (currentTab.value === 'profile') return false;
  return filterableTabs.includes(currentTab.value);
});

const currentFilterOptions = computed(() => {
  if (currentTab.value === 'profile') return [];
  return filterOptionsByTab[currentTab.value] || [];
});

const displayItems = computed(() => {
  if (currentTab.value === 'profile') return items.value;

  const baseItems = items.value.map((item) => {
    const row = { ...item };

    if (currentTab.value === 'clinicRooms') {
      const franchise = franchisesLookup.value.find((f) => f.franchise_id === item.franchise_id);
      row.franchise_name = franchise?.name || '-';
    }

    if (currentTab.value === 'clinicSchedules') {
      const franchise = franchisesLookup.value.find((f) => f.franchise_id === item.franchise_id);
      const room = roomsLookup.value.find((r) => r.room_id === item.room_id);
      row.franchise_name = franchise?.name || '-';
      row.room_name = item.room_id ? (room?.name || '-') : 'Horario general';
      row.day_of_week_label = dayLabels[Number(item.day_of_week)] || String(item.day_of_week);
    }

    if (currentTab.value === 'users') {
      const franchise = franchisesLookup.value.find((f) => f.franchise_id === item.franchise_id);
      row.franchise_name = franchise?.name || '-';
    }

    if (currentTab.value === 'pets') {
      const owner = usersLookup.value.find((u) => u.user_id === item.owner_id);
      row.owner_name = owner?.full_name || '-';
    }

    if (currentTab.value === 'appointments') {
      const pet = petsLookup.value.find((p) => p.pet_id === item.pet_id);
      const vet = usersLookup.value.find((u) => u.user_id === item.vet_id);
      const franchise = franchisesLookup.value.find((f) => f.franchise_id === item.franchise_id);
      const room = roomsLookup.value.find((r) => r.room_id === item.room_id);

      row.pet_name = pet?.name || '-';
      row.vet_name = vet?.full_name || '-';
      row.franchise_name = franchise?.name || '-';
      row.room_name = room?.name || '-';
    }

    if (currentTab.value === 'labTests') {
      const appointment = appointmentsLookup.value.find((a) => a.appointment_id === item.appointment_id);
      const pet = petsLookup.value.find((p) => p.pet_id === appointment?.pet_id);
      row.appointment_name = appointment
        ? `${new Date(appointment.date_time).toLocaleDateString('es-ES')} - ${pet?.name || 'Mascota'}`
        : '-';
    }

    if (currentTab.value === 'adoptionApplications') {
      const user = usersLookup.value.find((u) => u.user_id === item.user_id);
      const pet = petsLookup.value.find((p) => p.pet_id === item.pet_id);

      row.user_name = user?.full_name || '-';
      row.pet_name = pet?.name || '-';
    }

    return row;
  });

  if (!isVetPanel.value || !currentFranchiseId.value) return baseItems;

  return baseItems.filter((row) => {
    if (currentTab.value === 'services') return true;
    if (currentTab.value === 'franchises') return Number(row.franchise_id || 0) === currentFranchiseId.value;
    if (currentTab.value === 'clinicRooms') return Number(row.franchise_id || 0) === currentFranchiseId.value;
    if (currentTab.value === 'clinicSchedules') return Number(row.franchise_id || 0) === currentFranchiseId.value;
    if (currentTab.value === 'users') return Number(row.franchise_id || 0) === currentFranchiseId.value;
    if (currentTab.value === 'appointments') return Number(row.franchise_id || 0) === currentFranchiseId.value;
    if (currentTab.value === 'labTests') {
      const appointment = appointmentsLookup.value.find((a) => a.appointment_id === row.appointment_id);
      return Number(appointment?.franchise_id || 0) === currentFranchiseId.value;
    }
    if (currentTab.value === 'pets') {
      const owner = usersLookup.value.find((u) => u.user_id === row.owner_id);
      return Number(owner?.franchise_id || 0) === currentFranchiseId.value;
    }
    if (currentTab.value === 'adoptionApplications') {
      const user = usersLookup.value.find((u) => u.user_id === row.user_id);
      return Number(user?.franchise_id || 0) === currentFranchiseId.value;
    }
    return true;
  });
});

const filteredDisplayItems = computed(() => {
  if (!currentConfig.value) return displayItems.value;

  let result = [...displayItems.value];

  if (canFilterCurrentTab.value && filterValue.value !== 'all') {
    result = result.filter((row) => {
      if (currentTab.value === 'users') return String(row.role || '') === filterValue.value;
      return String(row.status || '') === filterValue.value;
    });
  }

  if (!canSearchCurrentTab.value || !searchQuery.value.trim()) return result;

  const query = searchQuery.value.toLowerCase();
  const keys = currentConfig.value.columns.map((c) => c.key);

  return result.filter((row) => {
    return keys.some((key) => {
      const value = row[key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(query);
    });
  });
});

const modalTitle = computed(() => {
  if (!currentConfig.value) return '';
  return isEdit.value ? `Editar ${currentConfig.value.label}` : `Nuevo ${currentConfig.value.label}`;
});

const modalFields = computed<AdminField[]>(() => {
  if (!currentConfig.value) return [];

  return currentConfig.value.fields.map((field) => {
    if (field.key === 'franchise_id') {
      const franchiseOptions = isVetPanel.value && currentFranchiseId.value
        ? franchisesLookup.value
          .filter((f) => Number(f.franchise_id) === currentFranchiseId.value)
          .map((f) => ({ label: f.name, value: f.franchise_id }))
        : franchisesLookup.value.map((f) => ({ label: f.name, value: f.franchise_id }));

      return {
        ...field,
        type: 'select',
        options: [
          { label: 'Sin franquicia', value: 0 },
          ...franchiseOptions
        ]
      };
    }

    if (field.key === 'owner_id') {
      return {
        ...field,
        type: 'select',
        options: [
          { label: 'Sin dueño', value: 0 },
          ...(isVetPanel.value ? usersScopedForVet.value : usersLookup.value).map((u) => ({ label: u.full_name, value: u.user_id }))
        ]
      };
    }

    if (field.key === 'pet_id') {
      return {
        ...field,
        type: 'select',
        options: (isVetPanel.value ? petsScopedForVet.value : petsLookup.value).map((p) => ({ label: p.name, value: p.pet_id }))
      };
    }

    if (field.key === 'vet_id') {
      return {
        ...field,
        type: 'select',
        options: (isVetPanel.value ? usersScopedForVet.value : usersLookup.value)
          .filter((u) => u.role === 'Vet' || u.role === 'Admin')
          .map((u) => ({ label: `${u.full_name} (${u.role})`, value: u.user_id }))
      };
    }

    if (field.key === 'room_id') {
      return {
        ...field,
        type: 'select',
        options: [
          { label: 'Sin sala', value: 0 },
          ...(isVetPanel.value ? roomsScopedForVet.value : roomsLookup.value).map((r) => ({ label: r.name, value: r.room_id }))
        ]
      };
    }

    if (field.key === 'user_id') {
      return {
        ...field,
        type: 'select',
        options: (isVetPanel.value ? usersScopedForVet.value : usersLookup.value).map((u) => ({ label: u.full_name, value: u.user_id }))
      };
    }

    if (field.key === 'appointment_id') {
      return {
        ...field,
        type: 'select',
        options: (isVetPanel.value ? appointmentsScopedForVet.value : appointmentsLookup.value).map((a) => {
          const pet = petsLookup.value.find((p) => p.pet_id === a.pet_id);
          return {
            label: `${new Date(a.date_time).toLocaleDateString('es-ES')} - ${pet?.name || 'Mascota'}`,
            value: a.appointment_id
          };
        })
      };
    }

    return field;
  });
});

const normalizeDateTimeToInput = (value: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const normalizeTimeValue = (value: string) => {
  if (!value) return '';
  if (value.includes('T')) return normalizeDateTimeToInput(value).split('T')[1] || value;
  return value.length >= 5 ? value.slice(0, 5) : value;
};

const buildFormForEdit = (item: Record<string, any>) => {
  if (!currentConfig.value) return {};

  const next: Record<string, any> = {};

  currentConfig.value.fields.forEach((field) => {
    let value = item[field.key];

    if (field.type === 'date' && typeof value === 'string' && value.includes('T')) {
      value = value.split('T')[0];
    }

    if (field.type === 'datetime-local' && typeof value === 'string') {
      value = normalizeDateTimeToInput(value);
    }

    if (field.type === 'time' && typeof value === 'string') {
      value = normalizeTimeValue(value);
    }

    if (field.type === 'checkbox') {
      value = !!value;
    }

    if (field.type === 'file') {
      value = null;
    }

    if ((value === undefined || value === null) && field.type !== 'file') {
      value = field.type === 'number' ? 0 : '';
    }

    next[field.key] = value;
  });

  return next;
};

const loadProfile = async () => {
  try {
    const response = await api.get(`/User/${authStore.userId}`);
    const user = response.data;

    profileForm.value = {
      full_name: user.full_name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'Admin',
      franchise_id: user.franchise_id || 0
    };
  } catch {
    const response = await api.get('/User');
    const user = response.data.find((u: any) => u.user_id === authStore.userId);

    if (user) {
      profileForm.value = {
        full_name: user.full_name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'Admin',
        franchise_id: user.franchise_id || 0
      };
    }
  }
};

const loadFranchisesLookup = async () => {
  try {
    const response = await api.get('/Franchise');
    franchisesLookup.value = response.data;
  } catch {
    franchisesLookup.value = [];
  }
};

const loadData = async () => {
  if (!currentConfig.value) return;

  loading.value = true;
  try {
    const response = await api.get(currentConfig.value.endpoint);
    items.value = response.data;
  } catch {
    if (!currentConfig.value.endpointFallback) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los datos.' });
      items.value = [];
      loading.value = false;
      return;
    }

    try {
      const fallbackResponse = await api.get(currentConfig.value.endpointFallback);
      items.value = fallbackResponse.data;
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los datos.' });
      items.value = [];
    }
  } finally {
    loading.value = false;
  }
};

const loadLookupsForTab = async () => {
  if (currentTab.value === 'profile') return;

  const requests: Promise<any>[] = [];

  if (['pets', 'appointments', 'adoptionApplications', 'labTests'].includes(currentTab.value)) {
    requests.push(
      api.get('/User').then((r) => {
        usersLookup.value = r.data;
      })
    );
  }

  if (['pets', 'appointments', 'labTests', 'adoptionApplications'].includes(currentTab.value)) {
    requests.push(
      api.get('/Pet').then((r) => {
        petsLookup.value = r.data;
      })
    );
  }

  if (['clinicRooms', 'clinicSchedules', 'users', 'appointments'].includes(currentTab.value)) {
    requests.push(
      api.get('/Franchise').then((r) => {
        franchisesLookup.value = r.data;
      })
    );
  }

  if (['appointments', 'clinicSchedules'].includes(currentTab.value)) {
    requests.push(
      api.get('/ClinicRoom')
        .then((r) => {
          roomsLookup.value = r.data;
        })
        .catch(async () => {
          const fallback = await api.get('/Clinic_room');
          roomsLookup.value = fallback.data;
        })
    );
  }

  if (currentTab.value === 'labTests') {
    requests.push(
      api.get('/Appointment').then((r) => {
        appointmentsLookup.value = r.data;
      })
    );
  }

  if (currentTab.value === 'appointments') {
    requests.push(
      api.get('/ClinicSchedule')
        .then((r) => {
          clinicSchedulesLookup.value = r.data;
        })
        .catch(async () => {
          const fallback = await api.get('/Clinic_schedule');
          clinicSchedulesLookup.value = fallback.data;
        })
    );
  }

  if (requests.length > 0) {
    await Promise.all(requests);
  }
};

const changeTab = async (tab: string) => {
  currentTab.value = tab as AdminEntityKey | 'profile';
  showModal.value = false;
  searchQuery.value = '';
  filterValue.value = 'all';

  if (currentTab.value === 'profile') {
    await Promise.all([loadProfile(), loadFranchisesLookup()]);
  } else {
    await Promise.all([loadData(), loadLookupsForTab()]);
  }
};

onMounted(async () => {
  if (!authStore.isLogged || !authStore.canAccessAdmin) {
    router.push('/auth/login');
    return;
  }

  await Promise.all([loadProfile(), loadFranchisesLookup()]);
});

const openCreate = () => {
  if (!currentConfig.value) return;
  if (!canCreate.value) return;

  isEdit.value = false;
  editId.value = 0;
  formData.value = { ...currentConfig.value.createData };
  if (isVetPanel.value && currentFranchiseId.value && Object.prototype.hasOwnProperty.call(formData.value, 'franchise_id')) {
    formData.value.franchise_id = currentFranchiseId.value;
  }
  showModal.value = true;
};

const openEdit = (item: Record<string, any>) => {
  if (!currentConfig.value) return;
  if (!canEdit.value) return;

  isEdit.value = true;
  editId.value = Number(item[currentConfig.value.idField]);
  formData.value = buildFormForEdit(item);
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const getUpdatePayload = (payload: Record<string, any>) => {
  if (!currentConfig.value) return payload;

  if (currentTab.value === 'users') {
    return { ...payload, user_id: editId.value, User_id: editId.value };
  }

  if (currentTab.value === 'pets') {
    return { ...payload, pet_id: editId.value, Pet_id: editId.value };
  }

  return { ...payload, [currentConfig.value.idField]: editId.value };
};

const timeToMinutes = (value: string) => {
  if (!value) return -1;
  const clean = value.slice(0, 5);
  const parts = clean.split(':');
  if (parts.length < 2) return -1;
  const h = Number.parseInt(parts[0] || '', 10);
  const m = Number.parseInt(parts[1] || '', 10);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return -1;
  return h * 60 + m;
};

const rangesOverlap = (startA: number, endA: number, startB: number, endB: number) => {
  return startA < endB && endA > startB;
};

const validateAppointmentPayload = (payload: Record<string, any>) => {
  const date = new Date(payload.date_time);
  if (Number.isNaN(date.getTime())) return 'Fecha/hora inválida.';

  const duration = Number(payload.duration_minutes || 0);
  if (!Number.isFinite(duration) || duration <= 0) return 'La duración debe ser mayor que 0.';

  const franchiseId = Number(payload.franchise_id || 0);
  if (!franchiseId) return 'Selecciona una franquicia.';

  const dayOfWeek = date.getDay();
  const minutes = date.getHours() * 60 + date.getMinutes();
  const endMinutes = minutes + duration;

  const roomId = Number(payload.room_id || 0);
  const normalizedSchedules = clinicSchedulesLookup.value.map((s) => {
    const franchise = Number(pick(s, ['franchise_id', 'Franchise_id', 'franchiseId', 'FranchiseId'], 0));
    const room = pick(s, ['room_id', 'Room_id', 'roomId', 'RoomId'], null);
    const day = Number(pick(s, ['day_of_week', 'Day_of_week', 'dayOfWeek', 'DayOfWeek'], -1));
    const open = String(pick(s, ['open_time', 'Open_time', 'openTime', 'OpenTime'], ''));
    const close = String(pick(s, ['close_time', 'Close_time', 'closeTime', 'CloseTime'], ''));
    const isOpenRaw = pick(s, ['is_open', 'Is_open', 'isOpen', 'IsOpen'], true);
    const isOpen = isOpenRaw === true || isOpenRaw === 1 || isOpenRaw === '1';
    return { franchise, room, day, open, close, isOpen };
  });

  // Si no hay horarios cargados, no bloquear en frontend; que valide backend.
  if (normalizedSchedules.length === 0) return '';

  const exactRoomSchedule = roomId
    ? normalizedSchedules.find((s) =>
      s.franchise === franchiseId
      && Number(s.room || 0) === roomId
      && s.day === dayOfWeek
      && s.isOpen)
    : null;

  const generalSchedule = normalizedSchedules.find((s) =>
    s.franchise === franchiseId
    && (s.room === null || Number(s.room || 0) === 0)
    && s.day === dayOfWeek
    && s.isOpen);

  const schedule = exactRoomSchedule || generalSchedule;
  if (!schedule) return `No hay horario abierto para ${dayLabels[dayOfWeek]}.`;

  const openMins = timeToMinutes(String(schedule.open || ''));
  const closeMins = timeToMinutes(String(schedule.close || ''));
  if (openMins < 0 || closeMins < 0) return 'Horario de clínica inválido.';
  if (minutes < openMins || endMinutes > closeMins) return `La cita está fuera del horario (${schedule.open} - ${schedule.close}).`;

  const currentId = isEdit.value ? editId.value : 0;
  const sameFranchiseAppointments = items.value.filter((a) =>
    Number(a.appointment_id) !== currentId
    && a.status !== 'Cancelada'
    && Number(a.franchise_id) === franchiseId);

  for (const a of sameFranchiseAppointments) {
    const aDate = new Date(a.date_time);
    if (Number.isNaN(aDate.getTime())) continue;
    if (aDate.toDateString() !== date.toDateString()) continue;

    const aStart = aDate.getHours() * 60 + aDate.getMinutes();
    const aEnd = aStart + Number(a.duration_minutes || 30);

    if (roomId && Number(a.room_id || 0) === roomId && rangesOverlap(minutes, endMinutes, aStart, aEnd)) {
      return 'Ya hay una cita en esa sala y franja horaria.';
    }

    if (Number(a.vet_id || 0) === Number(payload.vet_id || 0) && rangesOverlap(minutes, endMinutes, aStart, aEnd)) {
      return 'Ese veterinario ya tiene una cita en esa franja.';
    }
  }

  return '';
};

const normalizeAppointmentPayloadForApi = (payload: Record<string, any>) => {
  const next = { ...payload };

  if (next.room_id === 0 || next.room_id === '0' || next.room_id === '') {
    next.room_id = null;
  }

  if (next.vet_id === 0 || next.vet_id === '0' || next.vet_id === '') {
    next.vet_id = null;
  }

  if (next.franchise_id === 0 || next.franchise_id === '0' || next.franchise_id === '') {
    next.franchise_id = null;
  }

  return next;
};

const saveEntity = async (payload: Record<string, any>) => {
  if (!currentConfig.value) return;
  if (!canCreate.value && !isEdit.value) return;
  if (!canEdit.value && isEdit.value) return;

  try {
    if (isVetPanel.value && currentFranchiseId.value && Object.prototype.hasOwnProperty.call(payload, 'franchise_id')) {
      payload.franchise_id = currentFranchiseId.value;
    }

    if (currentTab.value === 'pets') {
      const selectedFile = payload.photo_url instanceof File ? payload.photo_url : null;
      const hasPhoto = !!selectedFile || (typeof payload.photo_url === 'string' && payload.photo_url.trim() !== '');

      if (!isEdit.value && !selectedFile) {
        Swal.fire({ icon: 'warning', title: 'Foto requerida', text: 'Selecciona una imagen para la mascota.' });
        return;
      }

      if (isEdit.value) {
        if (selectedFile) {
          Swal.fire({
            icon: 'warning',
            title: 'Imagen en edición',
            text: 'Ahora mismo la imagen solo se cambia al crear mascota.'
          });
          return;
        }

        const updatePayload = getUpdatePayload(payload);
        if (updatePayload.owner_id === 0 || updatePayload.owner_id === '0') {
          delete updatePayload.owner_id;
        }
        await api.put(currentConfig.value.endpoint, updatePayload);
      } else {
        const formDataToSend = new FormData();

        formDataToSend.append('Name', String(payload.name || ''));
        formDataToSend.append('Species', String(payload.species || ''));
        formDataToSend.append('Breed', String(payload.breed || ''));
        formDataToSend.append('Birth_date', payload.birth_date ? `${payload.birth_date}T00:00:00` : '');
        formDataToSend.append('Description', String(payload.description || ''));
        formDataToSend.append('Status', String(payload.status || 'En Adopción'));

        if (payload.owner_id && payload.owner_id !== 0 && payload.owner_id !== '0') {
          formDataToSend.append('Owner_id', String(payload.owner_id));
        }

        // Campo que exige Swagger para POST /Pet
        formDataToSend.append('Imagen', selectedFile as File);
        // Campo de BD (texto URL)
        formDataToSend.append('Photo_url', selectedFile ? selectedFile.name : String(payload.photo_url || ''));

        await api.post(currentConfig.value.endpoint, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
    } else if (currentTab.value === 'clinicSchedules') {
      const nextPayload = { ...payload };
      if (!nextPayload.room_id || Number(nextPayload.room_id) === 0) {
        nextPayload.room_id = null;
      }

      const openMins = timeToMinutes(String(nextPayload.open_time || ''));
      const closeMins = timeToMinutes(String(nextPayload.close_time || ''));
      if (openMins < 0 || closeMins < 0 || openMins >= closeMins) {
        Swal.fire({ icon: 'warning', title: 'Horario inválido', text: 'La hora de apertura debe ser menor que la de cierre.' });
        return;
      }

      if (isEdit.value) await api.put(currentConfig.value.endpoint, getUpdatePayload(nextPayload));
      else await api.post(currentConfig.value.endpoint, nextPayload);
    } else if (currentTab.value === 'appointments') {
      const normalizedPayload = normalizeAppointmentPayloadForApi(payload);

      // Si se confirma/completa, exige campos clave para evitar 400 del backend.
      if (
        ['Confirmada', 'Completada'].includes(String(normalizedPayload.status || ''))
        && (!normalizedPayload.date_time || !normalizedPayload.vet_id || !normalizedPayload.room_id)
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Datos incompletos',
          text: 'Para confirmar/completar una cita debes indicar fecha/hora, veterinario y sala.'
        });
        return;
      }

      const validationError = validateAppointmentPayload(normalizedPayload);
      if (validationError) {
        Swal.fire({ icon: 'warning', title: 'Cita inválida', text: validationError });
        return;
      }

      if (isEdit.value) await api.put(currentConfig.value.endpoint, getUpdatePayload(normalizedPayload));
      else await api.post(currentConfig.value.endpoint, normalizedPayload);
    } else if (isEdit.value) {
      await api.put(currentConfig.value.endpoint, getUpdatePayload(payload));
    } else {
      await api.post(currentConfig.value.endpoint, payload);
    }

    await loadData();
    closeModal();
    Swal.fire({ icon: 'success', title: 'Guardado correctamente' });
  } catch (error: any) {
    console.error('Admin saveEntity error:', error?.response?.data || error);

    const validationErrors = error?.response?.data?.errors;
    const validationMessage =
      validationErrors && typeof validationErrors === 'object'
        ? Object.values(validationErrors)
            .flat()
            .join(' | ')
        : undefined;

    const backendMessage =
      error?.response?.data?.message ||
      error?.response?.data?.title ||
      validationMessage ||
      (typeof error?.response?.data === 'string' ? error.response.data : undefined);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: backendMessage || 'No se pudo guardar.'
    });
  }
};

const deleteEntity = async (item: Record<string, any>) => {
  if (!currentConfig.value) return;
  if (!canDelete.value) return;

  const id = item[currentConfig.value.idField];

  const result = await Swal.fire({
    icon: 'warning',
    title: '¿Eliminar?',
    text: 'Esta acción no se puede deshacer.',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`${currentConfig.value.endpoint}?${currentConfig.value.deleteParam}=${id}`);
    await loadData();
    Swal.fire({ icon: 'success', title: 'Eliminado correctamente' });
  } catch {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar.' });
  }
};

const saveProfile = async () => {
  try {
    const payload: any = {
      full_name: profileForm.value.full_name,
      email: profileForm.value.email,
      role: isVetPanel.value ? 'Vet' : profileForm.value.role,
      franchise_id: isVetPanel.value
        ? (currentFranchiseId.value || profileForm.value.franchise_id || null)
        : (profileForm.value.franchise_id || null),
      user_id: authStore.userId,
      User_id: authStore.userId
    };

    if (profileForm.value.password.trim()) {
      payload.password = profileForm.value.password;
    }

    await api.put('/User', payload);
    profileForm.value.password = '';
    Swal.fire({ icon: 'success', title: 'Perfil actualizado' });
  } catch {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el perfil.' });
  }
};
</script>

<template>
  <div class="admin-layout">
    <AdminSidebar :activeTab="currentTab" @changeTab="changeTab" />

    <main class="admin-content">
      <div v-if="loading" class="loading">Cargando...</div>

      <template v-else>
        <section v-if="currentTab === 'profile'" class="section-card">
          <h1>{{ isVetPanel ? 'Mi Perfil Vet' : 'Mi Perfil Admin' }}</h1>

          <div class="profile-card">
            <form class="profile-grid" @submit.prevent="saveProfile">
              <div class="form-group">
                <label>Nombre</label>
                <input v-model="profileForm.full_name" type="text" required>
              </div>

              <div class="form-group">
                <label>Email</label>
                <input v-model="profileForm.email" type="email" required>
              </div>

              <div class="form-group">
                <label>Nueva contraseña</label>
                <input v-model="profileForm.password" type="password">
              </div>

              <div class="form-group">
                <label>Rol</label>
                <select v-model="profileForm.role" :disabled="isVetPanel">
                  <option v-for="role in userRoleOptions" :key="role" :value="role">{{ role }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Franquicia</label>
                <select v-model.number="profileForm.franchise_id" :disabled="isVetPanel">
                  <option :value="0">Sin franquicia</option>
                  <option
                    v-for="franchise in franchisesLookup"
                    :key="franchise.franchise_id"
                    :value="franchise.franchise_id"
                  >
                    {{ franchise.name }}
                  </option>
                </select>
              </div>

              <div class="profile-actions">
                <button class="btn-primary" type="submit">Guardar Perfil</button>
              </div>
            </form>
          </div>
        </section>

        <section v-else-if="currentConfig" class="section-card">
          <div class="section-header">
            <h1>{{ currentConfig.label }}</h1>
            <div class="section-actions">
              <select
                v-if="canFilterCurrentTab"
                v-model="filterValue"
                class="filter-select"
              >
                <option v-for="option in currentFilterOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <input
                v-if="canSearchCurrentTab"
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="Buscar..."
              >
              <button v-if="canCreate" class="btn-primary" @click="openCreate">+ Nuevo</button>
            </div>
          </div>

          <div class="table-wrap">
            <AdminTable
              :columns="currentConfig.columns"
              :items="filteredDisplayItems"
              :idField="currentConfig.idField"
              :showEdit="canEdit"
              :showDelete="canDelete"
              @edit="openEdit"
              @delete="deleteEntity"
            />
          </div>
        </section>
      </template>
    </main>

    <GenericModal
      :show="showModal"
      :title="modalTitle"
      :fields="modalFields"
      :data="formData"
      @close="closeModal"
      @save="saveEntity"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-content {
  flex: 1;
  padding: 24px;
  background: #f5f7f9;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 12px;
  }
}

.loading {
  font-family: v.$font-subtitle;
  color: v.$color-green-dark;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 14px;
  }
}

.section-card > h1 {
  font-family: v.$font-title;
  color: v.$color-green-dark;
  margin: 0 0 18px 0;
  line-height: 1.2;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h1 {
    font-family: v.$font-title;
    color: v.$color-green-dark;
    margin: 0;
  }
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  border: 2px solid v.$color-green-medium;
  border-radius: 8px;
  padding: 8px 10px;
  font-family: v.$font-subtitle;
  min-width: 220px;

  &:focus {
    outline: none;
    border-color: v.$color-peach-dark;
  }
}

.filter-select {
  border: 2px solid v.$color-green-medium;
  border-radius: 8px;
  padding: 8px 10px;
  font-family: v.$font-subtitle;
  min-width: 180px;

  &:focus {
    outline: none;
    border-color: v.$color-peach-dark;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.profile-card {
  width: 100%;
  background: #fafafa;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 20px;
  margin-top: 6px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;

  label {
    font-family: v.$font-subtitle;
    color: v.$color-green-dark;
    font-weight: v.$weight-bold;
    margin-bottom: 6px;
  }

  input,
  select {
    border: 2px solid v.$color-green-medium;
    border-radius: 8px;
    padding: 9px;
    font-family: v.$font-subtitle;
  }
}

.btn-primary {
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-family: v.$font-subtitle;
  font-weight: v.$weight-bold;
  background: v.$color-peach-medium;
  color: v.$color-green-dark;
}

.profile-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .section-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .filter-select,
  .search-input,
  .btn-primary {
    width: 100%;
    min-width: 0;
  }

  .profile-actions {
    justify-content: stretch;
  }
}
</style>
