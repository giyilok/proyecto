<template>
  <div class="profile">
    <!--  Título de la pestaña -->
    <div>
      <vue-headful title="Mi perfil" description="Perfil de usuario" />
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
    footerapp
  },
  props: {
    user: Object
  }
};
</script>

<style scoped>
.blank {
  height: 66px;
}
</style>
