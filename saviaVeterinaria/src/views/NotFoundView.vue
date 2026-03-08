<template>
  <main class="not-found">
    <section class="not-found__card">
      <p class="not-found__code">404</p>
      <h1 class="not-found__title">Página no encontrada</h1>
      <p class="not-found__text">La ruta a la que intentas acceder no existe.</p>
      <router-link to="/" class="btn btn--primary btn--small">Volver al inicio</router-link>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '../assets/styles/base/variables' as v;

.not-found {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: v.$color-green-light;
}

.not-found__card {
  max-width: 560px;
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(46, 91, 64, 0.2);
  border-radius: 14px;
  padding: 30px 20px;
}

.not-found__code {
  font-family: v.$font-title;
  font-size: 4rem;
  line-height: 1;
  color: v.$color-peach-dark;
  margin-bottom: 10px;
}

.not-found__title {
  margin-bottom: 10px;
  color: v.$color-green-dark;
}

.not-found__text {
  margin-bottom: 22px;
  font-family: v.$font-subtitle;
  color: v.$color-green-dark;
}
</style>
