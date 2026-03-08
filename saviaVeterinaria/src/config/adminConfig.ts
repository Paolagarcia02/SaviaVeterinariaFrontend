export interface AdminColumn {
  key: string;
  label: string;
}

export interface AdminOption {
  label: string;
  value: string | number;
}

export interface AdminField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'time' | 'datetime-local' | 'textarea' | 'select' | 'checkbox' | 'file';
  required?: boolean;
  options?: AdminOption[];
}

export interface AdminEntityConfig {
  label: string;
  endpoint: string;
  endpointFallback?: string;
  idField: string;
  deleteParam: string;
  columns: AdminColumn[];
  fields: AdminField[];
  createData: Record<string, any>;
}

export type AdminEntityKey =
  | 'franchises'
  | 'services'
  | 'clinicRooms'
  | 'clinicSchedules'
  | 'users'
  | 'pets'
  | 'appointments'
  | 'labTests'
  | 'adoptionApplications';

export const adminConfig: Record<AdminEntityKey, AdminEntityConfig> = {
  franchises: {
    label: 'Franquicias',
    endpoint: '/Franchise',
    idField: 'franchise_id',
    deleteParam: 'IdFranchise',
    columns: [
      { key: 'name', label: 'Nombre' },
      { key: 'address', label: 'Dirección' },
      { key: 'phone', label: 'Teléfono' }
    ],
    fields: [
      { key: 'name', label: 'Nombre', required: true },
      { key: 'address', label: 'Dirección', required: true },
      { key: 'phone', label: 'Teléfono' }
    ],
    createData: { name: '', address: '', phone: '' }
  },
  services: {
    label: 'Servicios',
    endpoint: '/Service',
    idField: 'service_id',
    deleteParam: 'IdService',
    columns: [
      { key: 'name', label: 'Nombre' },
      { key: 'description', label: 'Descripción' },
      { key: 'icon', label: 'Icono' }
    ],
    fields: [
      { key: 'name', label: 'Nombre', required: true },
      { key: 'description', label: 'Descripción', type: 'textarea', required: true },
      { key: 'icon', label: 'Icono' }
    ],
    createData: { name: '', description: '', icon: '' }
  },
  clinicRooms: {
    label: 'Clinic Rooms',
    endpoint: '/ClinicRoom',
    endpointFallback: '/Clinic_room',
    idField: 'room_id',
    deleteParam: 'IdRoom',
    columns: [
      { key: 'franchise_name', label: 'Franquicia' },
      { key: 'name', label: 'Nombre' },
      { key: 'room_type', label: 'Tipo' },
      { key: 'is_active', label: 'Activa' }
    ],
    fields: [
      { key: 'franchise_id', label: 'Franchise ID', type: 'number', required: true },
      { key: 'name', label: 'Nombre', required: true },
      {
        key: 'room_type',
        label: 'Tipo',
        type: 'select',
        required: true,
        options: [
          { label: 'Consulta', value: 'Consulta' },
          { label: 'Quirófano', value: 'Quirófano' },
          { label: 'Rayos X', value: 'Rayos X' },
          { label: 'Urgencias', value: 'Urgencias' },
          { label: 'Laboratorio', value: 'Laboratorio' }
        ]
      },
      { key: 'is_active', label: 'Activa', type: 'checkbox' }
    ],
    createData: { franchise_id: 0, name: '', room_type: 'Consulta', is_active: true }
  },
  clinicSchedules: {
    label: 'Horarios Clínica',
    endpoint: '/ClinicSchedule',
    endpointFallback: '/Clinic_schedule',
    idField: 'schedule_id',
    deleteParam: 'IdSchedule',
    columns: [
      { key: 'franchise_name', label: 'Franquicia' },
      { key: 'room_name', label: 'Sala' },
      { key: 'day_of_week_label', label: 'Día' },
      { key: 'open_time', label: 'Apertura' },
      { key: 'close_time', label: 'Cierre' },
      { key: 'is_open', label: 'Abierto' }
    ],
    fields: [
      { key: 'franchise_id', label: 'Franquicia', type: 'number', required: true },
      { key: 'room_id', label: 'Sala (opcional)', type: 'number' },
      {
        key: 'day_of_week',
        label: 'Día semana',
        type: 'select',
        required: true,
        options: [
          { label: 'Domingo (0)', value: 0 },
          { label: 'Lunes (1)', value: 1 },
          { label: 'Martes (2)', value: 2 },
          { label: 'Miércoles (3)', value: 3 },
          { label: 'Jueves (4)', value: 4 },
          { label: 'Viernes (5)', value: 5 },
          { label: 'Sábado (6)', value: 6 }
        ]
      },
      { key: 'open_time', label: 'Hora apertura', type: 'time', required: true },
      { key: 'close_time', label: 'Hora cierre', type: 'time', required: true },
      { key: 'is_open', label: 'Abierto', type: 'checkbox' }
    ],
    createData: { franchise_id: 0, room_id: 0, day_of_week: 1, open_time: '08:00', close_time: '20:00', is_open: true }
  },
  users: {
    label: 'Usuarios',
    endpoint: '/User',
    idField: 'user_id',
    deleteParam: 'IdUser',
    columns: [
      { key: 'full_name', label: 'Nombre' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Rol' },
      { key: 'franchise_name', label: 'Franquicia' }
    ],
    fields: [
      { key: 'full_name', label: 'Nombre', required: true },
      { key: 'email', label: 'Email', required: true },
      { key: 'password', label: 'Contraseña' },
      {
        key: 'role',
        label: 'Rol',
        type: 'select',
        required: true,
        options: [
          { label: 'Admin', value: 'Admin' },
          { label: 'Vet', value: 'Vet' },
          { label: 'User', value: 'User' }
        ]
      },
      { key: 'franchise_id', label: 'Franchise ID', type: 'number' }
    ],
    createData: { full_name: '', email: '', password: '', role: 'User', franchise_id: 0 }
  },
  pets: {
    label: 'Mascotas',
    endpoint: '/Pet',
    idField: 'pet_id',
    deleteParam: 'IdPet',
    columns: [
      { key: 'photo_url', label: 'Foto' },
      { key: 'name', label: 'Nombre' },
      { key: 'species', label: 'Especie' },
      { key: 'status', label: 'Estado' },
      { key: 'owner_name', label: 'Dueño' }
    ],
    fields: [
      { key: 'name', label: 'Nombre', required: true },
      { key: 'species', label: 'Especie', required: true },
      { key: 'breed', label: 'Raza' },
      { key: 'birth_date', label: 'Nacimiento', type: 'date', required: true },
      { key: 'photo_url', label: 'Foto', type: 'file' },
      { key: 'description', label: 'Descripción', type: 'textarea' },
      {
        key: 'status',
        label: 'Estado',
        type: 'select',
        required: true,
        options: [
          { label: 'Con Dueño', value: 'Con Dueño' },
          { label: 'En Adopción', value: 'En Adopción' },
          { label: 'Adoptado', value: 'Adoptado' }
        ]
      },
      { key: 'owner_id', label: 'Owner ID', type: 'number' }
    ],
    createData: { name: '', species: '', breed: '', birth_date: '', photo_url: null, description: '', status: 'En Adopción', owner_id: null }
  },
  appointments: {
    label: 'Citas',
    endpoint: '/Appointment',
    idField: 'appointment_id',
    deleteParam: 'IdAppointment',
    columns: [
      { key: 'date_time', label: 'Fecha' },
      { key: 'status', label: 'Estado' },
      { key: 'pet_name', label: 'Mascota' },
      { key: 'vet_name', label: 'Veterinario' },
      { key: 'franchise_name', label: 'Franquicia' },
      { key: 'room_name', label: 'Sala' }
    ],
    fields: [
      { key: 'date_time', label: 'Fecha/Hora', type: 'datetime-local', required: true },
      { key: 'duration_minutes', label: 'Duración', type: 'number', required: true },
      { key: 'reason', label: 'Motivo', type: 'textarea', required: true },
      {
        key: 'status',
        label: 'Estado',
        type: 'select',
        required: true,
        options: [
          { label: 'Pendiente', value: 'Pendiente' },
          { label: 'Confirmada', value: 'Confirmada' },
          { label: 'Completada', value: 'Completada' },
          { label: 'Cancelada', value: 'Cancelada' }
        ]
      },
      { key: 'notes', label: 'Notas', type: 'textarea' },
      { key: 'pet_id', label: 'Pet ID', type: 'number', required: true },
      { key: 'vet_id', label: 'Vet ID', type: 'number', required: true },
      { key: 'franchise_id', label: 'Franchise ID', type: 'number', required: true },
      { key: 'room_id', label: 'Room ID', type: 'number' }
    ],
    createData: { date_time: '', duration_minutes: 30, reason: '', status: 'Pendiente', notes: '', pet_id: 0, vet_id: 0, franchise_id: 0, room_id: 0 }
  },
  labTests: {
    label: 'Lab Tests',
    endpoint: '/LabTest',
    idField: 'test_id',
    deleteParam: 'IdTest',
    columns: [
      { key: 'appointment_name', label: 'Cita' },
      { key: 'test_type', label: 'Tipo' },
      { key: 'status', label: 'Estado' },
      { key: 'requested_at', label: 'Solicitado' }
    ],
    fields: [
      { key: 'appointment_id', label: 'Appointment ID', type: 'number', required: true },
      {
        key: 'test_type',
        label: 'Tipo',
        type: 'select',
        required: true,
        options: [
          { label: 'Analítica Sanguínea', value: 'Analítica Sanguínea' },
          { label: 'Análisis de Orina', value: 'Análisis de Orina' },
          { label: 'Coprocultivo', value: 'Coprocultivo' },
          { label: 'Radiografía', value: 'Radiografía' },
          { label: 'Ecografía', value: 'Ecografía' },
          { label: 'Biopsia', value: 'Biopsia' },
          { label: 'Citología', value: 'Citología' },
          { label: 'Otro', value: 'Otro' }
        ]
      },
      { key: 'result_data', label: 'Resultado', type: 'textarea' },
      { key: 'comments', label: 'Comentarios', type: 'textarea' },
      {
        key: 'status',
        label: 'Estado',
        type: 'select',
        required: true,
        options: [
          { label: 'Solicitada', value: 'Solicitada' },
          { label: 'En Proceso', value: 'En Proceso' },
          { label: 'Completada', value: 'Completada' }
        ]
      },
      { key: 'requested_at', label: 'Solicitado', type: 'datetime-local', required: true },
      { key: 'completed_at', label: 'Completado', type: 'datetime-local' }
    ],
    createData: { appointment_id: 0, test_type: 'Analítica Sanguínea', result_data: '', comments: '', status: 'Solicitada', requested_at: '', completed_at: '' }
  },
  adoptionApplications: {
    label: 'Solicitudes de Adopción',
    endpoint: '/AdoptionApplication',
    idField: 'application_id',
    deleteParam: 'IdApplication',
    columns: [
      { key: 'user_name', label: 'Usuario' },
      { key: 'pet_name', label: 'Mascota' },
      { key: 'status', label: 'Estado' },
      { key: 'application_date', label: 'Fecha' }
    ],
    fields: [
      { key: 'user_id', label: 'User ID', type: 'number', required: true },
      { key: 'pet_id', label: 'Pet ID', type: 'number', required: true },
      { key: 'message', label: 'Mensaje', type: 'textarea', required: true },
      {
        key: 'status',
        label: 'Estado',
        type: 'select',
        required: true,
        options: [
          { label: 'Pendiente', value: 'Pendiente' },
          { label: 'Aprobada', value: 'Aprobada' },
          { label: 'Rechazada', value: 'Rechazada' }
        ]
      },
      { key: 'application_date', label: 'Fecha', type: 'datetime-local' }
    ],
    createData: { user_id: 0, pet_id: 0, message: '', status: 'Pendiente', application_date: '' }
  }
};
