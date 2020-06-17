<template>
  <div class="login">
    <!--  Título de la pestaña -->
    <div>
      <vue-headful title="Login" description="Login de usuario" />
    </div>
    <!--  Título de la pestaña -->

    <!--  Formulario de login-->
    <form>
      <label for="email">Email:</label>
      <input
        type="email"
        name="email"
        required
        autofocus
        placeholder="Escribe tu email"
        v-model="email"
      />
      <br />

      <label for="pasword">Password:</label>
      <input
        type="password"
        name="password"
        placeholder="Escribe tu password"
        required
        v-model="password"
      />
      <br />

      <button>Entrar</button>

      <!-- Aviso de faltan campos por rellenar -->
      <p v-show="required">Debes rellenar todos los campos</p>
    </form>
    <!--  Formulario de login-->
  </div>
</template>

<script>
// import { loginUser } from "../api/utils";
// import Swal from "sweetalert2";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      correctData: false,
      required: false,
    };
  },
  components: {},
  methods: {
    // Función para comprobar por código si se dejó algún campo vacío
    validatingData() {
      if (this.email === "" || this.password === "") {
        this.correctData = false; // No enviar
        this.required = true; // Se muestra mensaje
      } else {
        this.correctData = true; // Sí enviar
        this.required = false; // No se muestra el mensaje
      }
    },
    async login() {
      // Comprobamos que se hayan introducido los campos
      this.validatingData();

      // Si los datos son correctos, los enviamos
      if (this.correctData) {
        try {
          // Intento hacer login
          await loginUser(this.email, this.password);

          // Si hay login que me lleve a la landing
          // TODO Cambiar about a la landing
          this.$router.push("/about");
        } catch (err) {
          Swal.fire({
            title: "Error!",
            text: err.response.data,
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      } else {
      }
    },
  },
};
</script>
