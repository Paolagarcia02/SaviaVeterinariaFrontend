<template>
  <main class="legal-page">
    <section class="legal-page__container">
      <h1>Aviso Legal</h1>
      <p class="legal-page__updated">Última actualización: 7 de marzo de 2026</p>

      <h2>1. Titular del sitio web</h2>
      <p>
        Titular: Clínica Veterinaria SAVIA (proyecto académico).<br>
        Email de contacto: info@saviaveterinaria.com
      </p>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web tiene finalidad informativa y de gestión de usuarios, mascotas, citas y adopciones
        dentro del proyecto SAVIA.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso y uso del sitio implica la aceptación de estas condiciones. El usuario se compromete
        a utilizar los contenidos y servicios de forma lícita y respetuosa.
      </p>

      <h2>4. Propiedad intelectual</h2>
      <p>
        Los contenidos del sitio (textos, diseño, código y recursos gráficos) pertenecen a sus autores
        y no pueden ser reproducidos sin autorización.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        Se intentará mantener la información actualizada y el servicio disponible, pero no se garantiza
        la ausencia de errores o interrupciones.
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
