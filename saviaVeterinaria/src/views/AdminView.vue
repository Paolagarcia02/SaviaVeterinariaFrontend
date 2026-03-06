<script setup lang="ts">
/**
 * Vista de Administración
 * Panel de control para gestionar mascotas y usuarios
 * Solo accesible para usuarios con rol de Admin
 */
import { ref, onMounted } from 'vue';
import { usePetStore } from '@/stores/petStore';
import api from '@/api/axios';
import AdminSidebar from '@/components/Admin/AdminSidebar.vue';
import AdminPetRow from '@/components/Admin/AdminPetRow.vue';
import AdminUserRow from '@/components/Admin/AdminUserRow.vue';
import PetFormModal from '@/components/Admin/PetFormModal.vue';
import UserFormModal from '@/components/Admin/UserFormModal.vue';
import type { User, Pet } from '@/models/type';
import Swal from 'sweetalert2';

const petStore = usePetStore();
const users = ref<User[]>([]);

const currentTab = ref('pets');

const showPetModal = ref(false);
const showUserModal = ref(false);

const editingPet = ref<Pet | null>(null);
const editingUser = ref<User | null>(null);

// Función para cargar la lista de usuarios desde el backend
const loadUsers = async () => {
    try {
        const response = await api.get('/User');
        users.value = response.data;
    } catch (e) {
        console.error("Error cargando usuarios");
    }
};

// Al montar el componente, cargamos mascotas y usuarios
onMounted(() => {
    petStore.fetchPets();
    loadUsers();
});

// Función genérica para eliminar mascotas o usuarios
const deleteItem = async (id: number, name: string, type: 'Pet' | 'User') => {
    const result = await Swal.fire({
        title: `¿Eliminar ${name}?`,
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Sí, borrar'
    });

    if (result.isConfirmed) {
        try {
            const endpoint = type === 'Pet' ? `/Pet?IdPet=${id}` : `/User?IdUser=${id}`;
            await api.delete(endpoint);
            type === 'Pet' ? await petStore.fetchPets() : await loadUsers();
            Swal.fire('¡Borrado!', '', 'success');
        } catch (e) {
            Swal.fire('Error', 'No se ha podido eliminar', 'error');
        }
    }
};

// Función para abrir el modal de mascotas (crear o editar)
const openPetModal = (pet?: Pet) => {
    editingPet.value = pet || null;
    showPetModal.value = true;
};

// Función para cerrar el modal de mascotas
const closePetModal = () => {
    showPetModal.value = false;
    editingPet.value = null;
};

// Función para guardar una mascota (crear o actualizar)
const savePet = async (petData: Partial<Pet>) => {
    try {
        if (editingPet.value) {
            await api.put('/Pet', { ...petData, Pet_id: editingPet.value.pet_id });
            Swal.fire('¡Actualizado!', 'Mascota actualizada correctamente', 'success');
        } else {
            await api.post('/Pet', petData);
            Swal.fire('¡Creado!', 'Mascota creada correctamente', 'success');
        }
        await petStore.fetchPets();
        closePetModal();
    } catch (error) {
        Swal.fire('Error', 'No se pudo guardar la mascota', 'error');
    }
};

// Función para abrir el modal de usuarios (crear o editar)
const openUserModal = (user?: User) => {
    editingUser.value = user || null;
    showUserModal.value = true;
};

// Función para cerrar el modal de usuarios
const closeUserModal = () => {
    showUserModal.value = false;
    editingUser.value = null;
};

// Función para guardar un usuario (crear o actualizar)
const saveUser = async (userData: Partial<User>) => {
    try {
        if (editingUser.value) {
            await api.put('/User', { ...userData, User_id: editingUser.value.user_id });
            Swal.fire('¡Actualizado!', 'Usuario actualizado correctamente', 'success');
        } else {
            await api.post('/User', {
                Full_name: userData.full_name,
                Email: userData.email,
                Password: userData.password,
                Role: userData.role || 'User'
            });
            Swal.fire('¡Creado!', 'Usuario creado correctamente', 'success');
        }
        await loadUsers();
        closeUserModal();
    } catch (error) {
        Swal.fire('Error', 'No se pudo guardar el usuario', 'error');
    }
};
</script>

<template>
    <div class="admin-layout">
        <AdminSidebar :activeTab="currentTab" @changeTab="(tab: string) => currentTab = tab" />

        <main class="admin-content">
            <section v-if="currentTab === 'pets'">
                <div class="header-actions">
                    <h1>Gestión de Mascotas</h1>
                    <button @click="openPetModal()" class="btn btn--primary">+ Añadir Mascota</button>
                </div>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Nombre</th>
                            <th>Especie</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AdminPetRow v-for="pet in petStore.pets" :key="pet.pet_id" :pet="pet"
                            @delete="(id: number, name: string) => deleteItem(id, name, 'Pet')"
                            @edit="openPetModal" />
                    </tbody>
                </table>
            </section>

            <section v-if="currentTab === 'users'">
                <div class="header-actions">
                    <h1>Gestión de Usuarios</h1>
                    <button @click="openUserModal()" class="btn btn--primary">+ Añadir Usuario</button>
                </div>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AdminUserRow v-for="user in users" :key="user.user_id" :user="user"
                            @delete="(id: number, name: string) => deleteItem(id, name, 'User')"
                            @edit="openUserModal" />
                    </tbody>
                </table>
            </section>
        </main>

        <PetFormModal 
            :show="showPetModal" 
            :pet="editingPet" 
            @close="closePetModal" 
            @save="savePet" 
        />

        <UserFormModal 
            :show="showUserModal" 
            :user="editingUser" 
            @close="closeUserModal" 
            @save="saveUser" 
        />
    </div>
</template>
<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.admin-layout {
    display: flex;
    height: 100vh;
    width: 100vw;
    background-color: #f0f2f5;
    overflow: hidden;

    .admin-content {
        flex: 1;
        height: 100vh;
        overflow-y: auto;
        padding: 40px;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    // Cabeceras limpias
    .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        h1 {
            font-family: v.$font-title;
            color: v.$color-green-dark;
            font-size: 2.2rem;
            margin: 0;
        }
    }


    .table-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        padding: 10px;
        width: 100%;
        overflow-x: auto;
    }

    .admin-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 800px;

        thead th {
            background-color: #fafbfc;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.75rem;
            padding: 16px;
            text-align: left;
            border-bottom: 2px solid #edf2f7;
        }


        :deep(td) {
            padding: 16px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
            vertical-align: middle;
        }

        tbody tr:hover {
            background-color: #f8fafc;
        }
    }

    .btn--primary {
        background-color: v.$color-green-dark;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s;

        &:hover {
            background-color: v.$color-peach-dark;
            transform: translateY(-1px);
        }
    }
}
</style> 
