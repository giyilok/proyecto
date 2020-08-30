<template>
  <div class="user-data">
    <h1>Datos de proveedor</h1>
    <form id="formulario">
      <label for="email">Email</label>
      <input type="email" v-model="email" />
      <br />

      <label for="password">Password</label>
      <input type="password" v-model="password" />
      <br />

      <label>Nombre:</label>
      <input type="text" v-model="name" />
      <br />

      <label>Apellidos:</label>
      <input type="text" v-model="lastName" />
      <br />

      <label>Fecha de nacimiento:</label>
      <input type="date" v-model="birthDate" />
      <br />

      <span>Género:</span>
      <input type="radio" id="femenino" name="gender" value="Femenino" v-model="picked" />
      <label for="femenino">Femenino</label>
      <input type="radio" id="masculino" name="gender" value="Masculino" v-model="picked" />
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
      <input type="file" name="avatar" v-on:change="getFile" />
      <br />

      <label for="phone">Teléfono de contacto:</label>
      <input type="tel" v-model.number="phone" />
      <br />

      <!-- Datos de proveedor -->
      <!-- <label for="init-work">¿Desde qué año trabajas en el sector?</label>
      <input type="month" v-model.number="initWork" />
      <br />-->

      <label for="init-work">¿Desde qué año trabajas en el sector?</label>
      <select name="init-work" id="init-work" v-model="selectedYear">
        <option disabled>Year:</option>
        <option v-for="year in years" :key="year" :value="year">
          {{
          year
          }}
        </option>
      </select>
      <br />

      <label for="biography">Cuéntanos algo acerca de ti:</label>
      <br />
      <textarea name="biography" id="biography" cols="30" rows="4" v-model="biography"></textarea>
      <br />

      <label for="speciality">¿Cuál es tu especialidad?</label>
      <input type="text" name="speciality" v-model="speciality" />
      <br />

      <button @click.prevent="enviar">Registrar</button>
    </form>

    <div class="show">
      <h2>Datos del formulario</h2>
      <p>{{ email }}</p>
      <p>{{ password }}</p>
      <p>{{ name }}</p>
      <p>{{ lastName }}</p>
      <p>{{ birthDate }}</p>
      <p>{{ picked }}</p>
      <p>{{ phone }}</p>
      <p>{{ selectedYear }}</p>
      <p>{{ selected }}</p>
      <p>{{ file }}</p>
      <p>{{ initWork }}</p>
      <p>{{ biography }}</p>
      <p>{{ speciality }}</p>
      <p>{{ speciality }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserData",
  data() {
    return {
      email: "",
      password: "",
      selected: "",
      name: "",
      lastName: "",
      birthDate: "",
      picked: "Femenino",
      phone: null,
      selectedYear: null,
      file: null,
      initWork: null,
      biography: "",
      speciality: "",
    };
  },
  props: {
    cities: Array,
  },
  computed: {
    years() {
      const year = new Date().getFullYear();
      return Array.from(
        { length: year - 1970 },
        (value, index) => 1970 + index
      );
    },
  },
  methods: {
    getFile(e) {
      this.file = e.target.files[0];
    },
    async enviar() {
      var self = this;
      console.log(this.file);
      //Inicializamos el formdata
      const formData = new FormData();
      formData.append("email", self.email);
      formData.append("password", self.password);
      //formData.append("city_name", self.selected);
      //formData.append("file", self.file);
      console.log(formData.get("email"));

      const response = await axios({
        url: `http://localhost:3001/user/register/`, // URL de la autenticación
        method: "POST", // Método de la autenticación
        data: {
          email: self.email,
          password: self.password,
          //grant_type: "password",
        },
      });

      console.log(response);
    },
  },
  created() {},
};
</script>

<style scoped>
.user-data {
  border: 1px solid red;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.show {
  border: 1px solid black;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
}

.show > p {
  margin: 0.5rem auto;
}
</style>
