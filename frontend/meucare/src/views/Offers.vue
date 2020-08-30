<template>
  <div class="offers">
    <!--  Título de la pestaña -->
    <div>
      <vue-headful title="Meucare" description="Cuidadores compartidos" />
    </div>
    <!--  Título de la pestaña -->

    <!--  Menú de navegación  -->
    <menuapp></menuapp>
    <!--  Menú de navegación  -->

    <div class="blank"></div>

    <!--------------------------------------------------->
    <!--  Contenido de la vista  -->

    <div class="view">
      <!--  Formulario de búsqueda  -->
      <form action>
        <input
          type="text"
          autofocus
          v-model="search"
          placeholder="Busca por necesidad, nombre, ciudad"
        />
        <button @click="searchOffers">Buscar</button>
      </form>

      <p>Filtra los resultados</p>
      <select name="selector" id="selector" @change="onChange" v-model="selected">
        <option value="1">Más nuevos</option>
        <option value="2">Mejor valorados</option>
        <option value="3">Más experiencia</option>
      </select>

      <!-- Test -->
      <!-- <input type="date" class="form-control" />
      <input type="date" />
      <input
        type="checkbox"
        v-bind:checked="checked"
        v-on:change="$emit('change', $event.target.checked)"
      />
      -->
      <!-- Test -->

      <!--  Formulario de búsqueda  -->

      <div class="container">
        <!--  Listado de ofertas  -->
        <ul class="offercard">
          <offercard
            v-for="offer in offers"
            :key="offer.offer_id"
            :offer="offer"
            v-on:redirect="redirect"
          />
        </ul>
        <!--  Listado de ofertas  -->

        <!--  Menú de usuario  -->
        <aside v-show="menuVisible">
          <menuuser :user="user" />
        </aside>
        <!--  Menú de usuario  -->

        <!--  Assets  -->
        <!--  Assets  -->
      </div>
    </div>
    <!--  Contenido de la vista  -->
    <!--------------------------------------------------->
    <!-- Footer -->
    <!--     <footerapp class="footerapp"></footerapp>  -->
    <!-- Footer -->
  </div>
</template>

<script>
import axios from "axios";
import menuapp from "../components/MenuApp";
import footerapp from "../components/FooterApp";
import offercard from "../components/OfferCardList";
import menuuser from "../components/MenuUser";
import { isLoggedIn, getUserId } from "../utils/utils";
import { URL } from "../config.js";

export default {
  name: "Offers",
  data() {
    return {
      search: "",
      offers: [],
      selected: 1,
      user: {},
      menuVisible: false,
    };
  },
  components: {
    menuapp,
    footerapp,
    offercard,
    menuuser,
  },
  methods: {
    async getOffers() {
      try {
        const response = await axios.get(
          `${URL}/offer/getoffers?sort=${this.selected}`
        );
        return (this.offers = response.data.results);
      } catch (error) {
        if (error.response.status === 404) {
          alert(error.response.data.message);
        } else {
          console.log("Ocurrio un error");
          console.log(error);
        }
      }
    },
    async searchOffers() {
      try {
        const response = await axios.get(
          `${URL}/offer/search?userName=${this.search}&lastName=${this.search}&city=${this.search}&category=${this.search}&availability=${this.search}&sort=${this.selected}`
        );

        this.offers = response.data.data;
      } catch (error) {
        if (error.response.status === 404) {
          alert(error.response.data.message);
        } else {
          console.log(error);
        }
      }
    },
    // Cada vez que cambie el selector traemos los resultado ordenados
    onChange() {
      if (this.search) {
        this.searchOffers();
      } else {
        this.getOffers();
      }
    },
    // Recupera el id del usuario del localstorage y carga sus datos
    // para pasárselos al componente menú de usuario
    async getUser() {
      const userId = getUserId();

      try {
        const result = await axios.get(`${URL}/user/${userId}`);

        this.user = result.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    // Redirecciona a la vista de la oferta donde se hace click
    redirect(offerId) {
      this.$router.push({
        name: "OfferView",
        params: { id: offerId },
      });
    },
  },
  // Al crearse el componente se cargan las ofertas disponibles
  // y el menú de usuario si está logueado
  created() {
    this.getOffers();

    if (isLoggedIn()) {
      this.menuVisible = true;
      this.getUser();
    }
  },
};
</script>

<style scoped>
.view {
  width: 80%;
  margin: 0 auto;
}

form {
  display: flex;
  height: 48px;
  margin: 1rem 0;
  justify-content: flex-start;
}

form input {
  width: 750px;
  max-width: 800px;
  border-radius: 12px;
  font-size: 18px;
}

.blank {
  height: 66px;
}

.container {
  display: flex;
}

.offercard {
  display: flex;
  flex-direction: column;
}
</style>
