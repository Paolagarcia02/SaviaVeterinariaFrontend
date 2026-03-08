<template>
  <main class="legal-page">
    <section class="legal-page__container">
      <h1>Política de Cookies</h1>
      <p class="legal-page__updated">Última actualización: 7 de marzo de 2026</p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Son pequeños archivos que se almacenan en tu dispositivo para recordar información
        sobre navegación y sesión.
      </p>

      <h2>2. Tipos de cookies utilizadas</h2>
      <p>
        Este sitio utiliza cookies técnicas necesarias para autenticación de sesión y funcionamiento
        básico de la aplicación.
      </p>

      <h2>3. Gestión de cookies</h2>
      <p>
        Puedes bloquear o eliminar cookies desde la configuración de tu navegador. Ten en cuenta
        que algunas funciones podrían dejar de funcionar correctamente.
      </p>

      <h2>4. Cambios en la política</h2>
      <p>
        Esta política puede actualizarse para reflejar cambios técnicos o normativos.
      </p>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '@/assets/styles/base/variables' as v;

.legal-page {
  background: v.$color-green-light;
  min-height: 100vh;
  padding: 32px 16px 64px;
}

.legal-page__container {
  max-width: 900px;
  margin: 0 auto;
  background: transparent;
  border: 1px solid rgba(50, 82, 67, 0.16);
  border-radius: 12px;
  padding: 24px;
}

h1,
h2 {
  color: v.$color-green-dark;
}

h1 {
  margin: 0 0 10px;
}

h2 {
  margin: 20px 0 8px;
}

p {
  font-family: v.$font-subtitle;
  color: #1f2937;
  line-height: 1.6;
  margin: 0;
}

.legal-page__updated {
  margin-bottom: 14px;
  color: #6b7280;
}
</style>
