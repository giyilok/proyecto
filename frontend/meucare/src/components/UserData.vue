<template>
  <div class="user-data">
    <h1>Datos de usuario</h1>
    <form>
      <label>Nombre:</label>
      <input type="text" />
      <br />

      <label>Apellido:</label>
      <input type="text" />
      <br />

      <label>Fecha de nacimiento:</label>
      <input type="date" />
      <br />

      <span>Género:</span>
      <input type="radio" id="femenino" name="gender" value="Femenino" />
      <label for="femenino">Femenino</label>
      <input type="radio" id="masculino" name="gender" value="Masculino" checked />
      <label for="masculino">Masculino</label>
      <br />

      <label for="city">Ciudad:</label>
      <select name="city" id="city" v-model="selected">
        <option disabled>Selecione su ciudad</option>
        <option
          v-for="city in cities"
          :key="city.city_id"
          :value="city.city_name"
        >{{ city.city_name }}</option>
      </select>
      <br />

      <label for="avatar">Sube una foto:</label>
      <input type="file" name="avatar" />
      <br />

      <label for="phone">Teléfono de contacto:</label>
      <input type="tel" />
    </form>

    <form action></form>
  </div>
</template>

<script>
export default {
  name: "UserData",
  data() {
    return {
      selected: ""
    };
  },
  props: {
    cities: Array
  },
  created() {
    console.log(this.cities);
  }
};
</script>

<style scoped>
.user-data {
  border: 1px solid red;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>