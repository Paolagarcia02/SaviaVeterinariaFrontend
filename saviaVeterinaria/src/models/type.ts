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
export interface User {
    user_id: number;
    full_name: string; 
    email: string;
    password?: string;
    role: 'Admin' | 'Vet' | 'User'; 
    created_at: string; 
}