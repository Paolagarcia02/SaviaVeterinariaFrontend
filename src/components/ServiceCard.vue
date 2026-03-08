<script setup lang="ts">
import type { Service } from '@/stores/serviceStore';

defineProps<{
  service: Service
}>();
</script>

<template>
  <div 
    class="service-card"
    :class="{ 'service-card--urgent': service.name.includes('Urgencias') }"
  >
    <div class="service-card__icon">{{ service.icon }}</div>
    <h3 class="service-card__title">{{ service.name }}</h3>
    <p class="service-card__description">{{ service.description }}</p>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.service-card {
  background: v.$color-green-light;
  border: 1.5px solid v.$color-green-dark;
  border-radius: 15px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.02);
  }

  &__icon {
    width: 120px;
    height: 120px;
    margin-bottom: 25px;
    font-size: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
  }

  &__title {
    font-family: v.$font-title;
    font-size: 1.5rem;
    color: v.$color-green-dark;
    margin-bottom: 15px;
  }

  &__description {
    font-family: v.$font-subtitle;
    font-size: 1rem;
    color: v.$color-green-dark;
    line-height: 1.6;
  }

  &--urgent {
    background: v.$color-peach-ligth;
    border-color: v.$color-peach-dark;

    .service-card__title {
      color: v.$color-peach-dark;
    }
  }
}
</style>
