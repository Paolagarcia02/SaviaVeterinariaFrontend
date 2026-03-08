<script setup lang="ts">
import { onMounted } from 'vue';
import { useServiceStore } from '@/stores/serviceStore';
import ServiceCard from '@/components/ServiceCard.vue';

const serviceStore = useServiceStore();

onMounted(() => {
  serviceStore.fetchServices();
});
</script>

<template>
  <main class="services-page">
    <section class="services-hero">
      <h1 class="services-hero__title">Nuestros Servicios</h1>
      <p class="services-hero__subtitle">Atención veterinaria integral para tu mascota</p>
    </section>

    <section class="services-grid">
      <ServiceCard 
        v-for="service in serviceStore.services" 
        :key="service.service_id" 
        :service="service"
      />
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.services-page {
  background: v.$color-green-light;
  min-height: 100vh;
  padding-bottom: 80px;
}

.services-hero {
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

.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
