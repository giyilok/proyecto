<template>
  <div>
    <label for="user-name">Nombre de usuario</label>
    <input
      type="text"
      id="user-name"
      placeholder="Escribe el nombre de usuario"
      required
      v-model="userName"
      autofocus
    />

    <label for="last-name">Apellidos</label>
    <input
      type="text"
      id="last-name"
      placeholder="Escribe tus apellidos"
      required
      v-model="lastName"
      autofocus
    />
  </div>
</template>

<script>
export default {
  name: "Customer",
};
</script>

<style scoped>
</style>
