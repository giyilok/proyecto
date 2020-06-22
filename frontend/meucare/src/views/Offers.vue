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
      <form action="">
        <input
          type="text"
          autofocus
          v-model="search"
          placeholder="Busca por necesidad, nombre, ciudad"
        />
        <button @click="searchOffers">Buscar</button>
      </form>

      <p>Filtra los resultados</p>
      <select
        name="selector"
        id="selector"
        @change="onChange"
        v-model="selected"
      >
        <option value="1">Más nuevos</option>
        <option value="2">Mejor valorados</option>
        <option value="4">Más experiencia</option>
      </select>

      <!--  Formulario de búsqueda  -->

      <div class="container">
        <!--  Listado de ofertas  -->
        <ul class="offercard">
          <offercard v-for="offer in offers" :key="offer.id" :offer="offer" />
        </ul>
        <!--  Listado de ofertas  -->

        <!--  Menú de usuario  -->
        <menuuser />
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

export default {
  name: "Offers",
  data() {
    return {
      search: "",
      offers: [],
      selected: 1,
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
        var self = this;
        const response = await axios.get(
          "http://localhost:3001/offer/random/5"
        );

        self.offers = response.data.payload;
        console.log(self.offers);
      } catch (error) {
        console.log(error);
      }
    },
    async searchOffers() {
      try {
        var self = this;
        const response = await axios.get(
          `http://localhost:3001/offer/search?userName=${this.search}&lastName=${this.search}&city=${this.search}&category=${this.search}&availability=${this.search}&sort=${this.selected}`
        );

        self.offers = response.data.data;
      } catch (error) {
        if (error.response.status === 404) {
          console.log(error.response.data.message);
        } else {
          console.log(error);
        }
      }
    },
    onChange() {
      this.searchOffers();
    },
  },
  created() {
    this.getOffers();
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

select {
  margin: ;
}
</style>
