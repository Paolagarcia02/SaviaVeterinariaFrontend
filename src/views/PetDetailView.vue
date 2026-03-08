<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import type { Pet } from '@/models/type';
import AdoptionModal from '@/components/AdoptionModal.vue';

const route = useRoute();
const router = useRouter();
const pet = ref<Pet | null>(null);
const loading = ref(true);
const showAdoptionModal = ref(false);

const petAge = computed(() => {
  if (!pet.value?.birth_date) return 'Desconocida';

  const birth = new Date(pet.value.birth_date);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) return `${years} año${years > 1 ? 's' : ''}`;
  return `${months} mes${months !== 1 ? 'es' : ''}`;
});

const normalizeStatus = (status: string) => {
  return status
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ /g, '-');
};

onMounted(async () => {
  try {
    const response = await api.get(`/Pet/${route.params.id}`);
    pet.value = response.data;
  } catch (error) {
    console.error('Error cargando mascota:', error);
    router.push('/pets');
  } finally {
    loading.value = false;
  }
});

const openAdoptionModal = () => {
  showAdoptionModal.value = true;
};

const closeAdoptionModal = () => {
  showAdoptionModal.value = false;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Fecha desconocida';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long'
  });
};

</script>

<template>
  <main v-if="!loading && pet" class="pet-detail">
    <div class="pet-detail__container">
      <button @click="router.back()" class="btn btn--secondary btn--small pet-detail__back">Volver</button>

      <section class="pet-detail__card">
        <figure class="pet-detail__media">
          <img :src="pet.photo_url" :alt="pet.name" />
          <span :class="['status-chip', normalizeStatus(pet.status)]">{{ pet.status }}</span>
        </figure>

        <div class="pet-detail__content">
          <header class="pet-detail__header">
            <h1>{{ pet.name }}</h1>
            <p>{{ pet.species }}<span v-if="pet.breed"> · {{ pet.breed }}</span></p>
          </header>

          <p class="pet-detail__description">
            {{
              pet.description ||
              `${pet.name} está buscando una familia responsable y cariñosa. Si conectas con su perfil, puede ser tu compañero ideal.`
            }}
          </p>

          <dl class="pet-detail__facts">
            <div class="fact-item">
              <dt>Edad</dt>
              <dd>{{ petAge }}</dd>
            </div>
            <div class="fact-item">
              <dt>Estado</dt>
              <dd :class="['fact-status', normalizeStatus(pet.status)]">{{ pet.status }}</dd>
            </div>
            <div class="fact-item">
              <dt>En Savia desde</dt>
              <dd>{{ formatDate(pet.created_at) }}</dd>
            </div>
            <div v-if="pet.owner_id" class="fact-item">
              <dt>Propietario</dt>
              <dd>Registrado</dd>
            </div>
          </dl>

          <div v-if="pet.status === 'En Adopción'" class="pet-detail__actions">
            <button @click="openAdoptionModal" class="btn btn--primary btn--small">Quiero adoptar</button>
          </div>

          <p v-else-if="pet.status === 'Adoptado'" class="pet-detail__message">
            {{ pet.name }} ya fue adoptado.
          </p>
        </div>
      </section>
    </div>

    <AdoptionModal
      v-if="pet"
      :pet="pet"
      :show="showAdoptionModal"
      @close="closeAdoptionModal"
      @success="closeAdoptionModal"
    />
  </main>

  <div v-else-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>Cargando información de la mascota...</p>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.pet-detail {
  min-height: 100vh;
  padding: 32px 16px;
  background: linear-gradient(180deg, v.$color-green-light 0%, #bfd6b4 100%);
}

.pet-detail__container {
  max-width: 1080px;
  margin: 0 auto;
}

.pet-detail__back {
  margin-bottom: 20px;
  min-width: auto;
  font-size: 1rem;
  padding: 10px 16px;
  border: none;
}

.pet-detail__card {
  background: linear-gradient(160deg, #dcecd0 0%, #cfe3c2 100%);
  border: 1px solid #b4cda4;
  border-radius: 16px;
  overflow: hidden;

  @media (min-width: 900px) {
    display: grid;
    grid-template-columns: 360px 1fr;
  }
}

.pet-detail__media {
  margin: 0;
  position: relative;
  min-height: 320px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.status-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  background: #dce8d3;
  color: #334;

  &.con-dueno {
    background: #e8f0ff;
    color: #234a95;
  }

  &.en-adopcion {
    background: #fff3df;
    color: #9b6200;
  }

  &.adoptado {
    background: #e7f6ec;
    color: #1f6b3a;
  }
}

.pet-detail__content {
  padding: 24px;
  background: rgba(212, 230, 198, 0.6);
}

.pet-detail__header {
  h1 {
    margin: 0;
    font-family: v.$font-title;
    font-size: clamp(2rem, 5vw, 2.8rem);
    color: v.$color-green-dark;
    line-height: 1.05;
  }

  p {
    margin: 8px 0 0;
    color: #5f6661;
    font-family: v.$font-subtitle;
    font-size: 1rem;
  }
}

.pet-detail__description {
  margin: 20px 0;
  font-family: v.$font-subtitle;
  color: #2c4134;
  line-height: 1.6;
}

.pet-detail__facts {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.fact-item {
  margin: 0;
  padding: 12px;
  background: #e8f2df;
  border: 1px solid #c6dcb6;
  border-radius: 10px;

  dt {
    font-size: 0.85rem;
    color: #5f6661;
    margin-bottom: 6px;
    font-family: v.$font-subtitle;
  }

  dd {
    margin: 0;
    font-family: v.$font-title;
    color: v.$color-green-dark;
    font-size: 1.05rem;
  }
}

.fact-status {
  &.con-dueno {
    color: #234a95;
  }

  &.en-adopcion {
    color: #9b6200;
  }

  &.adoptado {
    color: #1f6b3a;
  }
}

.pet-detail__actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 900px) {
    justify-content: flex-end;
  }
}

.pet-detail__actions :deep(.btn) {
  border: none;
  text-align: center;
}

.pet-detail__message {
  margin-top: 20px;
  padding: 12px;
  border: 1px solid #d6eadc;
  border-radius: 10px;
  background: #d8ecd9;
  color: #1f6b3a;
  font-family: v.$font-subtitle;
}

.loading-container {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 14px;
  text-align: center;

  p {
    margin: 0;
    font-family: v.$font-subtitle;
    color: v.$color-green-dark;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border-radius: 50%;
  border: 4px solid #dbe6d8;
  border-top-color: v.$color-peach-dark;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
