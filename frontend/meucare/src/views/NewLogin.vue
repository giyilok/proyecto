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

    <div class="container">
      <header>
        <h1>MeuCare</h1>
      </header>

      <!--  Formulario de login-->
      <div class="main">
        <h1>
          <span>Entra</span>
          <span>y encuentra a tus meus</span>
        </h1>

        <form>
          <fieldset class="email">
            <label for="email">Email:</label>
            <div class="relative">
              <input
                type="email"
                name="email"
                required
                autofocus
                placeholder="Escribe tu email"
                v-model="email"
              />
            </div>
          </fieldset>

          <fieldset>
            <label for="pasword">Password:</label>
            <div class="relative">
              <input
                type="password"
                name="password"
                placeholder="Escribe tu password"
                required
                v-model="password"
              />
            </div>
          </fieldset>

          <!-- Aviso de faltan campos por rellenar -->
          <p v-show="required">Debes rellenar todos los campos</p>

          <button @click="login">Entrar</button>
        </form>
      </div>

      <p>
        ¿No tienes cuenta?
        <router-link :to="{ name: 'Register' }">Regístrate aquí</router-link>
      </p>
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

body {
  background-color: #eee;
}

.blank {
  height: 66px;
}

.login {
  position: relative;
  height: 100vh;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container header h1 {
  color: var(--my-color4);
  padding: 48px 24px;
}

.container .main {
  border: 2px solid rgb(233, 236, 239);
  padding: 32px;
  margin-bottom: 32px;
  border-radius: 8px;
}

.main h1 {
  margin-bottom: 24px;
}

.main h1 span {
  display: block;
  color: var(--my-color4);
  font-weight: 600;
  text-align: center;
}

.main h1 span:last-of-type {
  display: block;
  color: var(--my-color2);
  font-size: 20px;
}

form {
  color: var(--my-color4);
  display: block;
  font-size: 16px;
}

form fieldset {
  margin-bottom: 24px;
  border: 0;
}

form fieldset label {
  display: block;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

form fieldset .relative {
  color: rgb(73, 80, 87);
  display: block;
  font-size: 16px;
  position: relative;
}

form fieldset .relative input {
  background-color: #e7f0fe;
  border-bottom-color: rgb(222, 226, 230);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-image-outset: 0;
  border-image-repeat: stretch;
  border-image-slice: 100%;
  border-image-source: none;
  border-image-width: 1;
  border-left-color: rgb(222, 226, 230);
  border-left-style: solid;
  border-left-width: 2px;
  border-right-color: rgb(222, 226, 230);
  border-right-style: solid;
  border-right-width: 2px;
  border-top-color: rgb(222, 226, 230);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-top-style: solid;
  border-top-width: 2px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 2px 0px inset;
  box-sizing: border-box;
  color: rgb(73, 80, 87);
  font-size: 20px;
  font-stretch: 100%;
  font-weight: 400;
  height: 48px;
  letter-spacing: normal;
  line-height: 20px;
  padding-bottom: 24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 24px;
  text-align: start;
  text-indent: 0px;
  text-rendering: auto;
  text-shadow: none;
  text-size-adjust: 100%;
  text-transform: none;
  transition-delay: 0s;
  transition-duration: 0.1s;
  transition-property: all;
  transition-timing-function: ease-in-out;
  width: 318.234px;
  word-spacing: 0px;
  writing-mode: horizontal-tb;
}

form button {
  border-radius: 6px;
  color: white;
  font-size: 20px;
  font-weight: 600;
  background: var(--my-color1);
  padding: 14px 0;
  border: 0;
  width: 318px;
}

.login p {
  color: rgb(73, 80, 87);
}

.login p a {
  color: var(--my-color1);
}

a {
  color: var(--my-color4);
}

p {
  text-align: center;
  color: red;
  margin-bottom: 1rem;
}
</style>
