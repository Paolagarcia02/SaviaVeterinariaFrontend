<template>
  <main class="legal-page">
    <section class="legal-page__container">
      <h1>Política de Privacidad</h1>
      <p class="legal-page__updated">Última actualización: 7 de marzo de 2026</p>

      <h2>1. Datos que tratamos</h2>
      <p>
        Podemos tratar datos de identificación y contacto (nombre, email), así como información
        de mascotas y citas para prestar los servicios de la plataforma.
      </p>

      <h2>2. Finalidad del tratamiento</h2>
      <p>
        Gestionar cuentas de usuario, solicitudes de cita, adopciones, historiales básicos y comunicación
        relacionada con la actividad del sitio.
      </p>

      <h2>3. Base jurídica</h2>
      <p>
        El tratamiento se realiza en base al consentimiento del usuario y a la ejecución de los servicios
        solicitados dentro de la plataforma.
      </p>

      <h2>4. Conservación</h2>
      <p>
        Los datos se conservarán durante el tiempo necesario para la finalidad descrita o hasta que
        el usuario solicite su supresión, salvo obligación legal.
      </p>

      <h2>5. Derechos</h2>
      <p>
        El usuario puede ejercer sus derechos de acceso, rectificación, supresión y oposición
        contactando en: info@saviaveterinaria.com
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
