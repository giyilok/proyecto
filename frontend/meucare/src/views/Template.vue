<template>
  <div class="landing">
    <!--  Título de la pestaña -->
    <div>
      <vue-headful title="Meucare" description="Cuidadores compartidos" />
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
  name: "Landing",
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
