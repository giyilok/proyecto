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
    <userdata :cities="cities"></userdata>
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
import userdata from "../components/UserData";

export default {
  name: "ProviderRegister",
  data() {
    return {
      cities: []
    };
  },
  components: {
    menuapp,
    footerapp,
    userdata
  },
  methods: {
    async getCities() {
      var self = this;

      try {
        const response = await axios.get("http://localhost:3001/city/");
        self.cities = response.data.cities;
        console.log(self.cities);
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.getCities();
  }
};
</script>

<style scoped>
.blank {
  height: 66px;
}
</style>
