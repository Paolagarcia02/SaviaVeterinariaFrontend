// Interfaz que define la estructura de una mascota
export interface Pet {
    pet_id: number;
    name: string;
    species: string; 
    breed: string | null; 
    birth_date: string; 
    photo_url: string; 
    description?: string; 
    status: 'Con Dueño' | 'En Adopción' | 'Adoptado'; 
    owner_id: number | null; 
    created_at?: string; 
}

// Interfaz extendida de Pet que incluye la edad calculada
export interface AdoptionPet extends Pet {
    age: string; 
}

// Interfaz que define la estructura de un usuario
export interface Service {
  service_id: number;
  name: string;
  description: string;
  icon: string;
}

export interface AdoptionApplication {
  application_id: number;
  user_id: number;
  pet_id: number;
  pet_name?: string;
  message: string;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada';
  application_date: string;
}

export interface Appointment {
  appointment_id: number;
  date_time: string;
  duration_minutes: number;
  reason: string;
  status: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';
  notes?: string;
  pet_id: number;
  vet_id: number;
  franchise_id: number;
  room_id?: number;
}

export interface LabTest {
  test_id: number;
  appointment_id: number;
  test_type: 'Analítica Sanguínea' | 'Análisis de Orina' | 'Coprocultivo' | 'Radiografía' | 'Ecografía' | 'Biopsia' | 'Citología' | 'Otro';
  result_data?: string;
  comments?: string;
  status: 'Solicitada' | 'En Proceso' | 'Completada';
  requested_at: string;
  completed_at?: string;
}

export interface Franchise {
  franchise_id: number;
  name: string;
  address: string;
  phone?: string;
  created_at: string;
}

export interface ClinicRoom {
  room_id: number;
  franchise_id: number;
  name: string;
  room_type: 'Consulta' | 'Quirófano' | 'Rayos X' | 'Urgencias' | 'Laboratorio';
  is_active: boolean;
}

export interface User {
    user_id: number;
    full_name: string; 
    email: string;
    password?: string;
    role: 'Admin' | 'Vet' | 'User'; 
    created_at: string; 
}