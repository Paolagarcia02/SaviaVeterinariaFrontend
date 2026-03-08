<script setup lang="ts">
defineProps<{
  title: string;
  image: string;
  isUrgent?: boolean;
}>();
</script>

<template>
  <div class="service-card" :class="{ 'service-card--urgent': isUrgent }">
    <img :src="image" :alt="title">
    <h3>{{ title }}</h3>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.service-card {
  border: 1.5px solid v.$color-green-dark;
  border-radius: 15px;
  padding: 40px 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 25px;
  }

  h3 {
    font-family: v.$font-title;
    color: v.$color-green-dark;
  }

  &:hover {
    transform: translateY(-5px);
    background: rgba(0, 0, 0, 0.02);
  }

  &--urgent {
    background: v.$color-peach-ligth;
    border-color: v.$color-peach-dark;

    h3 {
      color: v.$color-peach-dark;
    }
  }
}
</style>
