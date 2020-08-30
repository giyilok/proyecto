<template>
  <div class="provider-register">
    <!--  Título de la pestaña -->
    <div>
      <vue-headful title="Registro provedor" description="Registro para proveedores" />
    </div>
    <!--  Título de la pestaña -->

    <!--  Menú de navegación  -->
    <menuapp></menuapp>
    <!--  Menú de navegación  -->

    <div class="blank"></div>

    <!--  Contenido de la vista  -->
    <main>
      <h1>Registro de proveedor</h1>
      <form id="formulario">
        <label for="email">Email</label>
        <input type="email" v-model="email" />

        <label for="password">Password</label>
        <input type="password" v-model="password" />

        <label for="passwordrepeat">Repite la password</label>
        <input type="password" v-model="passwordrepeat" />

        <label>Nombre:</label>
        <input type="text" v-model="name" />

        <label>Apellido:</label>
        <input type="text" v-model="lastName" />

        <label>Fecha de nacimiento:</label>
        <input type="date" v-model="birthDate" />

        <label>
          Género:
          <input type="radio" id="femenino" name="gender" value="Female" v-model="picked" />
          <label for="femenino">Femenino</label>
          <input type="radio" id="masculino" name="gender" value="Male" v-model="picked" />
          <label for="masculino">Masculino</label>
        </label>

        <label for="city">Ciudad:</label>
        <select name="city" id="city" v-model="selected">
          <option disabled>Selecione su ciudad</option>
          <option
            v-for="city in cities"
            :key="city.city_id"
            :value="city.city_name"
          >{{ city.city_name }}</option>
        </select>

        <label for="avatar">Sube una foto:</label>
        <input type="file" name="avatar" v-on:change="getFile" />

        <label for="phone">Teléfono de contacto:</label>
        <input type="tel" v-model.number="phone" />

        <!-- Datos de proveedor -->
        <!-- <label for="init-work">¿Desde qué año trabajas en el sector?</label>
      <input type="month" v-model.number="initWork" />
        <br />-->

        <label for="init-work">¿Desde qué año trabajas en el sector?</label>
        <select name="init-work" id="init-work" v-model="selectedYear">
          <option disabled>Año:</option>
          <option v-for="year in years" :key="year" :value="year">
            {{
            year
            }}
          </option>
        </select>

        <label for="biography">Cuéntanos algo acerca de ti:</label>

        <textarea name="biography" id="biography" cols="30" rows="4" v-model="biography"></textarea>

        <label for="speciality">¿Cuál es tu especialidad?</label>
        <input type="text" name="speciality" v-model="speciality" />

        <button class="button-primary" @click.prevent="sendProvider">Registrar</button>
      </form>

      <div class="show">
        <h2>Datos del formulario</h2>
        <p>{{ email }}</p>
        <p>{{ password }}</p>
        <p>{{ passwordrepeat }}</p>
        <p>{{ name }}</p>
        <p>{{ lastName }}</p>
        <p>{{ birthDate }}</p>
        <p>{{ picked }}</p>
        <p>{{ phone }}</p>
        <p>{{ selectedYear }}</p>
        <p>{{ selected }}</p>
        <p>{{ file }}</p>
        <p>{{ biography }}</p>
        <p>{{ speciality }}</p>
      </div>
    </main>

    <!--  Contenido de la vista  -->

    <!-- Footer -->
    <footerapp class="footerapp"></footerapp>
    <!-- Footer -->
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import menuapp from "../components/MenuApp";
import footerapp from "../components/FooterApp";
import { URL } from "../config";

export default {
  name: "ProviderRegister",
  data() {
    return {
      cities: [],
      email: "",
      password: "",
      passwordrepeat: "",
      selected: "",
      name: "",
      lastName: "",
      birthDate: "",
      picked: "Female",
      phone: null,
      selectedYear: null,
      file: null,
      initWork: null,
      biography: "",
      speciality: "",
    };
  },
  components: {
    menuapp,
    footerapp,
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
    async getCities() {
      try {
        const response = await axios.get(`${URL}/city/`);
        this.cities = response.data.cities;
      } catch (error) {
        console.log(error);
      }
    },
    getFile(e) {
      this.file = e.target.files[0];
    },
    async sendProvider() {
      //Inicializamos el formdata
      const formData = new FormData();

      //Añadimos los datos necesarios al formData
      formData.append("email", this.email);
      formData.append("password", this.password);
      formData.append("user_name", this.name);
      formData.append("last_name", this.lastName);
      formData.append("birth_date", this.birthDate);
      formData.append("gender", this.picked);
      formData.append("city_name", this.selected);
      formData.append("phone", this.phone);
      formData.append("initWork", this.selectedYear);
      formData.append("biography", this.biography);
      formData.append("speciality", this.speciality);
      formData.append("photo", this.file);

      try {
        await axios.post(
          `${URL}/provider/`, // URL de la autenticación
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Mostramos modal indicando registro exitoso
        Swal.fire({
          title: "¡Registro OK!",
          text: "Proveedor registrado con éxito",
          icon: "success",
          confirmButtonText: "Ok",
        });
      } catch (error) {
        // Si el error es que ya existe un usuario con ese email
        console.log("el problema está aquí", error.response.status);
        if ((error.response.status === 409) | (error.response.status === 400)) {
          // Vaciamos los campos para corrección
          //this.emptyFields();¡
          console.log(error);
          // Mostramos modal con el error
          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "Ok",
          });
        } else {
          // Si es cualquier otro error lo muestra por consola
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getCities();
  },
};
</script>

<style scoped>
.blank {
  height: 66px;
}

.provider-register {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

main {
  flex: 1;
}

#formulario {
  display: flex;
  flex-direction: column;
  /*column-gap: 0.5rem;*/
}

#formulario > input {
  margin-bottom: 5px;
}

.show {
  margin: 3rem auto;
  border: 1px solid black;
  text-align: center;
}

.show > * {
  margin: 5px auto;
}

button {
  margin: 1rem auto 0;
}

.footerapp {
  width: 100%;
  text-align: center;
}
</style>
