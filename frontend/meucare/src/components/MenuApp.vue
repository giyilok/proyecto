<template>
  <div class="menu">
    <div id="nav">
      <router-link :to="{ name: 'Landing' }">Inicio</router-link>
      <router-link :to="{ name: 'Login' }">Login</router-link>
      <router-link :to="{ name: 'NewLogin' }">New Login</router-link>
      <router-link :to="{ name: 'Register' }">Registro</router-link>
      <router-link :to="{ name: 'Offers' }">Offers</router-link>
      <router-link :to="{ name: 'About' }">About</router-link>
      <router-link :to="{ name: 'ProviderRegister' }">Registro_Proveedor</router-link>
      <router-link :to="{ name: 'NewOfferView' }">Nueva_oferta</router-link>
    </div>

    <div class="info" v-if="loged">
      <router-link :to="{name: 'UserProfile'}">
        <span>Hola, {{ name }}</span>
      </router-link>
      <button @click="logoutUser">Logout</button>
    </div>
  </div>
</template>

<script>
import {
  clearLogin,
  getUserName,
  isLoggedIn,
  checkAdmin,
} from "../utils/utils";

export default {
  name: "MenuCustom",
  data() {
    return {
      name: "",
      visible: false,
      loged: false,
    };
  },
  methods: {
    logoutUser() {
      this.$router.push("/");
      return clearLogin();
    },
  },
  created() {
    if (isLoggedIn()) {
      this.loged = true;
      this.name = getUserName();
    }
  },
  // TODO Hacer el control de roles definitivo para control
  // de visibilidad en los menús
  mounted() {
    /* if (checkAdmin()) {
      this.visible = true;
    } */
  },
};
</script>

<style scoped>
.menu {
  position: fixed;
  top: 0;
  background: white;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid black;
}

.info {
  display: inline-block;
}

span {
  display: inline-block;
}

p {
  display: inline-block;
  font-size: 18px;
}

#nav {
  padding: 15px;
  display: inline-block;
  flex-grow: 1;
}

#nav a {
  margin: 0 5px;
  text-decoration: none;
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #fc953a;
}

button {
  width: 70px;
  padding: 4px 0;
  border: none;
  font-size: 14px;
  color: #fc953a;
  background: white;
  border: 1px solid;
  border-radius: 18px;
  font-weight: 300;
  margin: 0 10px;
}
</style>
