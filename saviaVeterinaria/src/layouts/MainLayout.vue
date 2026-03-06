<script setup lang="ts">
/**
 * Layout principal de la aplicación
 * Incluye header, contenido dinámico y footer
 * Se usa para todas las páginas públicas (home, pets, etc.)
 */
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
</script>

<template>
  <div class="main-layout">
    <!-- Header fijo en la parte superior -->
    <AppHeader />
    <!-- Contenido dinámico que cambia según la ruta -->
    <main class="content">
      <router-view /> 
    </main>
    <!-- Footer al final de la página -->
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
}
</style>