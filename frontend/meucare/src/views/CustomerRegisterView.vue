<template>
  <div class="customer-register">
    <!--  Título de la pestaña -->
    <div>
      <vue-headful title="Registro cliente" description="Registro del cliente" />
    </div>
    <!--  Título de la pestaña -->

    <!--  Menú de navegación  -->
    <menuapp></menuapp>
    <!--  Menú de navegación  -->

    <div class="blank"></div>

    <!--  Contenido de la vista  -->

    <!--  Contenido de la vista  -->

    <!-- Footer -->
    <footerapp class="footerapp"></footerapp>
    <!-- Footer -->
  </div>
</template>

<script>
import Swal from "sweetalert2";
import menuapp from "../components/MenuApp";
import footerapp from "../components/FooterApp";

export default {
  name: "CustomerRegister",
  components: {
    menuapp,
    footerapp,
  },
};
</script>

<style scoped>
.blank {
  height: 66px;
}
</style>
