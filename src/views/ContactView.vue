<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFranchiseStore } from '@/stores/franchiseStore';
import api from '@/api/axios';
import Swal from 'sweetalert2';

const franchiseStore = useFranchiseStore();
const name = ref('');
const email = ref('');
const phone = ref('');
const message = ref('');

onMounted(() => {
  franchiseStore.fetchFranchises();
});

const handleSubmit = async () => {
  try {
    await api.post('/Contact', {
      name: name.value,
      email: email.value,
      phone: phone.value,
      message: message.value
    });
    
    Swal.fire({
      icon: 'success',
      title: '¡Mensaje enviado!',
      text: 'Nos pondremos en contacto contigo pronto.',
      confirmButtonColor: '#f3a683'
    });
    
    name.value = '';
    email.value = '';
    phone.value = '';
    message.value = '';
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
      confirmButtonColor: '#f3a683'
    });
  }
};
</script>

<template>
  <main class="contact-page">
    <section class="contact-hero">
      <h1 class="contact-hero__title">Contacto</h1>
      <p class="contact-hero__subtitle">Estamos aquí para ayudarte</p>
    </section>

    <div class="contact-container">
      <section class="contact-info">
        <div v-if="franchiseStore.loading" class="loading">Cargando información...</div>
        
        <template v-else>
          <div v-for="franchise in franchiseStore.franchises" :key="franchise.franchise_id" class="franchise-card">
            <h3 class="franchise-card__title">🏢 {{ franchise.name }}</h3>
            <div class="info-item">
              <span class="info-label">📍 Dirección:</span>
              <span class="info-text">{{ franchise.address }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📞 Teléfono:</span>
              <span class="info-text">{{ franchise.phone }}</span>
            </div>
          </div>
        </template>

        <div class="info-card">
          <h3 class="info-card__title">📧 Email</h3>
          <p class="info-card__text">info@saviaveterinaria.com</p>
        </div>

        <div class="info-card">
          <h3 class="info-card__title">🕐 Horario</h3>
          <p class="info-card__text">
            Lunes - Viernes: 9:00 - 20:00<br>
            Sábados: 10:00 - 14:00<br>
            Domingos: Urgencias
          </p>
        </div>
      </section>

      <section class="contact-form-section">
        <h2 class="contact-form-section__title">Envíanos un mensaje</h2>
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-group">
            <label for="name" class="form-label">Nombre</label>
            <input v-model="name" type="text" id="name" class="form-input" required>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input v-model="email" type="email" id="email" class="form-input" required>
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">Teléfono</label>
            <input v-model="phone" type="tel" id="phone" class="form-input">
          </div>

          <div class="form-group">
            <label for="message" class="form-label">Mensaje</label>
            <textarea v-model="message" id="message" class="form-textarea" rows="5" required></textarea>
          </div>

          <button type="submit" class="btn btn--primary btn--full">Enviar mensaje</button>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.contact-page {
  background: v.$color-green-light;
  min-height: 100vh;
  padding-bottom: 80px;
}

.contact-hero {
  padding: 60px 20px;
  text-align: center;

  &__title {
    font-family: v.$font-title;
    font-size: 3rem;
    color: v.$color-green-dark;
    margin-bottom: 15px;
  }

  &__subtitle {
    font-family: v.$font-subtitle;
    font-size: 1.3rem;
    color: v.$color-green-dark;
    opacity: 0.8;
  }
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;

  @media (min-width: 968px) {
    grid-template-columns: 1fr 1.5fr;
  }
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.franchise-card {
  background: v.$color-green-light;
  border: 2px solid v.$color-peach-dark;
  border-radius: 15px;
  padding: 25px;

  &__title {
    font-family: v.$font-title;
    font-size: 1.4rem;
    color: v.$color-peach-dark;
    margin-bottom: 15px;
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: center;
  }
}

.info-label {
  font-family: v.$font-subtitle;
  font-weight: v.$weight-bold;
  color: v.$color-green-dark;
  margin-bottom: 5px;
  min-width: 100px;

  @media (min-width: 480px) {
    margin-bottom: 0;
    margin-right: 10px;
  }
}

.info-text {
  font-family: v.$font-subtitle;
  color: v.$color-green-dark;
}

.info-card {
  background: v.$color-green-light;
  border: 2px solid v.$color-green-dark;
  border-radius: 15px;
  padding: 25px;

  &__title {
    font-family: v.$font-title;
    font-size: 1.3rem;
    color: v.$color-green-dark;
    margin-bottom: 10px;
  }

  &__text {
    font-family: v.$font-subtitle;
    color: v.$color-green-dark;
    line-height: 1.6;
  }

  &__label {
    font-family: v.$font-subtitle;
    font-size: 0.9rem;
    color: v.$color-peach-dark;
    font-weight: v.$weight-bold;
    margin-top: 5px;
  }
}

.contact-form-section {
  background: v.$color-green-light;
  border: 2px solid v.$color-green-dark;
  border-radius: 15px;
  padding: 40px 30px;
  max-height: fit-content;

  &__title {
    font-family: v.$font-title;
    font-size: 1.8rem;
    color: v.$color-green-dark;
    margin-bottom: 30px;
    text-align: center;
  }
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-family: v.$font-subtitle;
  font-weight: v.$weight-bold;
  color: v.$color-green-dark;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  padding: 12px 15px;
  border: 2px solid v.$color-green-medium;
  border-radius: 8px;
  font-family: v.$font-subtitle;
  font-size: 1rem;
  color: v.$color-green-dark;
  background: rgba(255, 255, 255, 0.5);

  &:focus {
    outline: none;
    border-color: v.$color-peach-dark;
  }
}

.form-textarea {
  resize: vertical;
}

.loading {
  text-align: center;
  font-family: v.$font-subtitle;
  font-size: 1.2rem;
  color: v.$color-green-dark;
  padding: 40px 20px;
}

.btn--full {
  width: 100%;
  padding: 15px;
  background-color: v.$color-peach-dark;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: v.$font-title;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: v.$color-peach-medium;
    transform: translateY(-2px);
  }
}
</style>
