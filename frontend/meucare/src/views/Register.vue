<template>
  <div class="register">
    <!--  Título de la pestaña -->
    <div>
      <vue-headful title="Register" description="Registro de usuario" />
    </div>
    <!--  Título de la pestaña -->

    <!--  Menú de navegación  -->
    <menuapp></menuapp>
    <!--  Menú de navegación  -->

    <div class="blank"></div>

    <!-- Formulario para añadir clientes-->
    <div class="container">
      <form>
        <h2>Registro de usuario</h2>
        <p v-show="required">Hay que rellenar todos los campos</p>

        <!-- Input para nombre -->
        <label for="email">Email:</label>
        <input type="email" name="email" placeholder="Introduce tu email" required v-model="email" />
        <br />

        <!-- Input para apellido -->
        <label for="password">Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Introduce tu password"
          required
          v-model="password"
        />
        <br />

        <!-- Input para ciudad -->
        <label for="repeatPassword">Password:</label>
        <input
          type="password"
          name="repeatPassword"
          placeholder="Repite tu password"
          v-model="repeatPassword"
        />
        <br />
        <p v-show="match">Las contraseñas no coinciden</p>
        <br />

        <!-- Botón para crear usurio -->
        <button @click.prevent="addClient">Crear Usuario</button>
      </form>
    </div>

    <!-- Footer -->
    <footerapp class="footerapp"></footerapp>
    <!-- Footer -->

    <!-- Formulario -->
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import menuapp from "../components/MenuApp";
import footerapp from "../components/FooterApp";

export default {
  name: "AddClient",
  data() {
    return {
      email: "",
      password: "",
      repeatPassword: "",
      correctData: false,
      required: false,
      match: false,
    };
  },
  components: {
    menuapp,
    footerapp,
  },
  methods: {
    // Función para comprobar si se dejó algún campo vacío
    validatingData() {
      if (
        // Si hay algún campo vacío se muestra mensaje de error
        this.email === "" ||
        this.password === "" ||
        this.repeatPassword === ""
      ) {
        this.correctData = false; // No enviar datos
        this.required = true; // Se muestra mensaje de campo vacío
        this.match = false; // No se muestra mensaje de passwords no match
      } else if (
        // Comprobar si password y repeatPassword son iguales
        this.password != this.repeatPassword
      ) {
        this.correctData = false; // No enviar datos
        this.required = false; // No se muestra mensaje de campo vacío
        this.match = true; // Se muestra mensaje de no coincidencia de passwords
      } else {
        this.correctData = true; // Enviar datos
        this.required = false; // No se muestra mensaje de campo vacío
        this.match = false; // No se muestra mensaje de no match
      }
    },
    async addClient(email, password) {
      // Validando datos del formulario
      this.validatingData();

      if (this.correctData) {
        try {
          const response = await axios.post(
            "http://localhost:3001/user/register",
            {
              email: this.email,
              password: this.password,
              role: 1,
            }
          );

          // Vaciamos los campos para la siguiente inserción
          //this.emptyFields();

          // Imprimimos por pantalla el resultado exitoso
          Swal.fire({
            title: "¡Usuario registrado!",
            text: "Te has registrado magistralmente",
            icon: "success",
            confirmButtonText: "Ok",
          });

          // Redirigimos al login
          this.$router.push("Login");
        } catch (error) {
          // Si el error es que ya existe un usuario con ese email
          if (error.response.status === 409) {
            // Vaciamos los campos para corrección
            this.emptyFields();

            // Mostramos modal con el error
            Swal.fire({
              title: "Error",
              text: error.response.data.message,
              icon: "error",
              confirmButtonText: "Ok",
            });
          } else {
            // Si es cualquier otro error lo muestra por consola
            console.log(error.response.data.message);
          }
        }
      }
    },
  },
  emptyFields() {
    this.email = "";
    this.password = "";
    this.repeatPaswword = "";
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

.footercustom {
  color: white;
}

.register {
  position: relative;
  height: 100vh;
  /* background-image: url("~@/assets/mountain.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat; */
}

.container {
  margin-top: 3rem;
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
  color: #f96c1a;
}
</style>
