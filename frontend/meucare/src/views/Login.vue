<template>
  <div class="login">
    <!--  Título de la pestaña -->
    <div>
      <vue-headful title="Login" description="Login de usuario" />
    </div>
    <!--  Título de la pestaña -->

    <!--  Menú de navegación  -->
    <menuapp></menuapp>
    <!--  Menú de navegación  -->

    <div class="blank"></div>

    <!--  Formulario de login-->
    <div class="container">
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

        <!-- Aviso de faltan campos por rellenar -->
        <p v-show="required">Debes rellenar todos los campos</p>
        <button @click="login">Entrar</button>
      </form>
      <router-link :to="{ name: 'Register' }"
        >O puedes registrarte aquí</router-link
      >
    </div>
    <!--  Formulario de login-->

    <!-- Footer -->
    <footerapp class="footerapp"></footerapp>
    <!-- Footer -->
  </div>
</template>

<script>
// Importamos las funcuinones necesarias
import { loginUser } from "../utils/utils";
import Swal from "sweetalert2";
import menuapp from "../components/MenuApp";
import footerapp from "../components/FooterApp";

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
  components: {
    menuapp,
    footerapp,
  },
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
          console.log("Allá vamos!");
          // Intento hacer login
          await loginUser(this.email, this.password);

          // Si hay login que me lleve a la landing
          this.$router.push("/");
        } catch (error) {
          // Si el error es alguno de los customizados
          const status = error.response.status;
          if (status === 400 || status === 401 || status === 404) {
            Swal.fire({
              title: "Error!",
              text: error.response.data.message,
              icon: "error",
              confirmButtonText: "Ok",
            });
          }
        }
      } else {
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: content-box;
}

.blank {
  height: 66px;
}

.login {
  position: relative;
  height: 100vh;
}

.container {
  position: absolute;
  left: 50%;
  top: 25%;
  transform: translate(-50%, -50%);
  padding: 20px 25px;
  width: 250px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  border-radius: 18px;
}

.container h2 {
  text-align: center;
  color: #fafafa;
}

.container h3 {
  text-align: left;
  color: #fafafa;
  margin-bottom: 20px;
  border-bottom: 4px solid #df7438;
}

.container form input {
  width: calc(100% - 20px);
  padding: 3px 10px;
  margin-bottom: 10px;
  border: none;
  background-color: transparent;
  border-bottom: 2px solid #df7438;
  color: #fff;
  font-size: 20px;
  outline: none;
}

.container form label {
  display: block;
  text-align: left;
  color: #f0a87e;
}
.container form input::placeholder {
  color: #e2e2e2;
  font-size: 18px;
}

.container form button {
  width: 100%;
  padding: 5px 0;
  border: none;
  background-color: #df7438;
  font-size: 18px;
  color: #fafafa;
  border-radius: 18px;
}

.login .footercustom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
  color: white;
}

a {
  display: inline-block;
  text-decoration: none;
  margin-top: 6px;
}

a:link {
  color: white;
}

a:visited {
  color: white;
}

p {
  color: #df7438;
}
</style>
