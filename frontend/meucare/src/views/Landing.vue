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

    <!--------------------------------------------------->
    <!--  Contenido de la vista  -->
    <main>
      <div class="container-section">
        <section id="search">
          <h1>
            Decide.
            <br />Comparte.
            <br />Déjate cuidar.
          </h1>

          <h4>
            Busca los servicios que necesitas y agrúpate con gente de tu zona
            para contratar profesionales ahorrando dinero
          </h4>

          <input type="text" placeholder="Buscar" />

          <p>Lo que más necesita la gente</p>

          <div class="tags">
            <button>Higiene</button>
            <button>Compras</button>
            <button>Transporte</button>
            <button>Cuidados</button>
          </div>
        </section>

        <section class="provider-info">
          <figure>
            <img src="../assets/caregiver.jpeg" alt />
          </figure>
          <div class="container">
            <h2>Yo quiero cuidar</h2>
            <div class="container-text">
              <h3>¿Eres profesional de los cuidados?</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam
                hac lectus viverra potenti. Mattis sit volutpat sed porta
                mattis.
              </p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam
                hac lectus viverra potenti. Mattis sit volutpat sed porta
                mattis.
              </p>

              <button>¡Me apunto!</button>
            </div>
          </div>
        </section>
      </div>

      <section class="last-providers">
        <h3>Los últimos cuidadores</h3>
        <div class="offercard">
          <offercard v-for="offer in offers" :key="offer.id" v-bind:offer="offer"></offercard>
        </div>
      </section>
    </main>

    <!--  Contenido de la vista  -->
    <!--------------------------------------------------->

    <!-- Footer -->
    <footerapp class="footerapp"></footerapp>
    <!-- Footer -->
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import menuapp from "../components/MenuApp";
import footerapp from "../components/FooterApp";
import offercard from "../components/OfferCardFront";

export default {
  name: "Landing",
  data() {
    return {
      offers: [],
    };
  },
  components: {
    menuapp,
    footerapp,
    offercard,
  },
  methods: {
    async getFrontInfo() {
      try {
        const response = await axios.get(
          "http://localhost:3001/offer/random/4"
        );

        this.offers = response.data.payload;
        console.log(this.offers);
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getFrontInfo();
  },
};
</script>

<style scoped>
.blank {
  height: 66px;
}

body {
  width: 80%;
}

main {
}

.container-section {
  display: flex;
  flex-wrap: wrap;
}

#search {
  text-align: left;
  margin: 0 2rem;
}

.tags {
  display: flex;
  justify-content: space-between;
}

.tags button {
  background: none;
  padding: 6px 24px;
  border-radius: 18px;
  border: 0.5px solid;
}

.provider-info {
  position: relative;
}

.provider-info figure img {
  width: 800px;
  border-radius: 24px;
}

.container {
  position: absolute;
  width: 300px;
  right: 40px;
  top: 30px;
}

.container-text {
  border-radius: 40px;
  background: #eae9e9;
  background-color: rgba(166, 175, 184, 0.5);
}

.last-providers {
}

.last-providers h3 {
}

.offercard {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>
