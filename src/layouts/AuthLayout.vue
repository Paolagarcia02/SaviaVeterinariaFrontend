<script setup lang="ts">
/**
 * Layout de autenticación
 * Layout simple sin header ni footer
 * Se usa para las páginas de login, registro y admin
 */
</script>

<template>
  <div class="auth-layout">
    <!-- Solo renderiza el contenido de la ruta, sin header ni footer -->
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>