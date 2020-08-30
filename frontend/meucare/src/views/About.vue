<template>
  <div class="about">
    <!--  Menú de navegación  -->
    <menuapp></menuapp>
    <!--  Menú de navegación  -->

    <div class="blank"></div>

    <main v-if="isLoaded">
      <h1>Proyecto realizado por:</h1>
      <h2>Guillermo Taboada</h2>
      <br />
      <p>Nombre: {{ admin.user_name}}</p>
      <p>Apellido: {{ admin.last_name}}</p>
      <p>Fecha de nacimiento: {{ admin.birth_date}}</p>
      <img :src="getImage()" alt="Foto de Giyi" />
    </main>
    <!-- Footer -->
    <!-- <footerapp class="footerapp"></footerapp> -->
    <!-- Footer -->
  </div>
</template>

<script>
import menuapp from "../components/MenuApp";
import footerapp from "../components/FooterApp";
import axios from "axios";
import { URL } from "../config.js";

export default {
  name: "About",
  data() {
    return {
      admin: null,
    };
  },
  components: {
    menuapp,
    footerapp,
  },
  computed: {
    isLoaded() {
      return this.admin != null;
    },
  },
  methods: {
    async getAdmin() {
      try {
        const response = await axios.get(`${URL}/user/11`);

        return (this.admin = response.data.data);
      } catch (error) {
        if (error.response.status === 404) {
          alert(error.response.data.message);
        } else {
          console.log(error);
        }
      }
    },
    getImage() {
      return `${URL}/uploads/${this.admin.image}`;
    },
    async getOffer() {
      const result = await axios.get(`${URL}/offer/5`);
      console.log(result);
    },
  },
  created() {
    this.getAdmin();
    this.getOffer();
  },
};
</script>

<style scoped>
.blank {
  height: 66px;
}

.about {
  display: flex;
  flex-direction: column;
  align-items: center;
}

img {
  width: 150px;
  border-radius: 16px;
  margin-top: 2rem;
}
</style>
