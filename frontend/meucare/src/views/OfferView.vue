<template>
  <div class="offer-view">
    <!--  Título de la pestaña -->
    <div>
      <vue-headful title="Oferta" description="Página de la oferta" />
    </div>
    <!--  Título de la pestaña -->

    <!--  Menú de navegación  -->
    <menuapp></menuapp>
    <!--  Menú de navegación  -->

    <div class="blank"></div>

    <!--  Contenido de la vista  -->
    <main v-if="isLoaded">
      <!-- Información del proveedor -->
      <provider class="provider" :providerInfo="providerInfo"></provider>
      <!-- Información del proveedor -->

      <!-- Información de la oferta -->
      <div class="offer">
        <h1>{{ offer.title }}</h1>

        <h2>Categorías:</h2>
        <ul>
          <li v-for="category in categories" :key="category.id">{{ category.category_name }}</li>
        </ul>

        <h2>Descripción de la oferta:</h2>
        <p>{{ offer.description}}</p>

        <h3>Features:</h3>
        <ul>
          <li v-for="feature in features" :key="feature.id">{{ feature.feature_name }}</li>
        </ul>

        <p>Número mínimo de usuarios: {{offer.customer_min}}</p>
        <p>Número máximo de usuarios en el grupo {{ offer.customer_min }}</p>
        <p>Localización: {{ offer.city_name }}</p>
        <p>Precio: {{ offer.price }}€ / {{ offer.price_type }}</p>

        <p>Disponibilidad horaria:</p>
        <ul>
          <li v-for="av in availabilities" :key="av.id">{{ av.av_name }}</li>
        </ul>

        <p>Estado actual de la oferta: {{statusName}}</p>

        <!-- Información de la oferta -->

        <!-- Botones -->
        <div v-if="isCustomer" class="customer">
          <button v-if="booking" class="button-primary" v-on:click.prevent="newBooking">Reservar</button>
          <button v-else class="button-primary" v-on:click.prevent="deleteBooking">Borrar reserva</button>
        </div>

        <div v-else>
          <button v-show="buttonVisible[0]" class="button-primary" @click="archive">Archivar</button>
          <button v-show="buttonVisible[1]" class="button-primary" @click.prevent="publish">Publicar</button>
          <button v-show="buttonVisible[2]" class="button-primary" @click="edit">Editar</button>
        </div>
      </div>
    </main>

    <!--  Contenido de la vista  -->

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
import provider from "../components/Provider";
import { URL } from "../config";
import {
  getRole,
  getAuthToken,
  getUserId,
  getStatusName,
} from "../utils/utils";
import api from "@/api/api";

export default {
  name: "Offer",
  components: {
    menuapp,
    footerapp,
    provider,
  },
  data() {
    return {
      offerId: null,
      providerInfo: null,
      offer: {},
      categories: [],
      availabilities: [],
      features: [],
      booking: true,
      status: null,
      statusName: "",
      visible: false,
      buttonVisible: [null, null, null],
      role: 0,
    };
  },
  computed: {
    isLoaded() {
      return this.visible != false;
    },
    isCustomer() {
      if (this.role === "1" || this.role === "0") {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    status: async function (newStatus, oldStatus) {
      // Obtiene el nombre del estado actual cada vez que éste cambia
      this.statusName = getStatusName(newStatus);

      const userId = getUserId();
      // Si es un cliente registrado
      if (this.role === "1") {
        const checkBooking = await api.checkBookingByUser(this.offerId, userId);

        // Comprobar si el usuario ya tiene reserva de esta oferta
        if (checkBooking) {
          this.booking = false;
        }
      } else if (this.role === "2") {
        const hasBooking = await api.offerHasBooking(this.offerId);
        console.log("Anterior status", oldStatus, "Nuevo status", newStatus);
        console.log("Estado almacenado", this.status);
        switch (newStatus) {
          case 0:
            // Si la oferta está en borrador: se puede archivar, publicar o editar
            this.$set(this.buttonVisible, 0, true);
            this.$set(this.buttonVisible, 1, true);
            this.$set(this.buttonVisible, 2, true);

            break;

          case 1:
            // Si la oferta está en publicada y no tiene ninguna reserva: se puede archivar o editar
            // Si la oferta está publicada y tiene alguna oferta: no se puede modificar (en principio)
            console.log("¿Tiene reservas?", hasBooking);
            if (!hasBooking) {
              this.$set(this.buttonVisible, 0, true);
              this.$set(this.buttonVisible, 1, false);
              this.$set(this.buttonVisible, 2, true);
            } else {
              console.log("En el else", hasBooking);
              this.$set(this.buttonVisible, 0, false);
              this.$set(this.buttonVisible, 1, false);
              this.$set(this.buttonVisible, 2, false);
            }
            break;

          case 2:
            // Si la oferta está activada, solo se puede archivar
            this.$set(this.buttonVisible, 0, false);
            this.$set(this.buttonVisible, 1, false);
            this.$set(this.buttonVisible, 2, true);

            break;

          default:
            break;
        }
      } else {
        console.log("El usuario es anónimo");
      }
    },
  },
  methods: {
    async getDataOffer() {
      await this.getOffer();
      await this.getCategories();
      await this.getAvailability();
      await this.getFeatures();
    },
    async getOffer() {
      try {
        // Obtenemos los datos de la oferta con el id especificado
        const response = await axios.get(`${URL}/offer/${this.offerId}`);

        this.offer = response.data.data;
        console.log("Primer print", this.offer);

        // Obtenemos los datos del proveedor de la oferta especificada
        // para pasarselo al componente provider
        const responseProvider = await axios.get(
          `${URL}/provider/${this.offer.provider_id}`
        );

        this.providerInfo = responseProvider.data.data;
        this.status = this.offer.statusx;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async getCategories() {
      try {
        const response = await axios.get(`${URL}/category/${this.offerId}`);

        this.categories = response.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async getAvailability() {
      try {
        const response = await axios.get(`${URL}/availability/${this.offerId}`);

        this.availabilities = response.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async getFeatures() {
      try {
        const response = await axios.get(`${URL}/feature/${this.offerId}`);

        this.features = response.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async newBooking() {
      // Si no es usuario anónimo mostramos modal indicando que el registro
      // es necesario para reservar. Si se quiere registrar se redirige a la
      // vista register, si no vuelve a la vista de la oferta
      const role = getRole();

      if (!role) {
        const redirect = await Swal.fire({
          title: "Atención!!",
          text: "Para reservar la oferta necesitas estar registrado",
          icon: "warning",
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: "Registrarse",
          cancelButtonText: "Volver",
        });

        if (redirect.isConfirmed) {
          this.$router.push({ name: "CustomerRegister" });
        }
      }

      try {
        // Comprobamos que el usuario no tenga reserva ya de esta oferta
        const token = getAuthToken();
        console.log(token);
        // Insertamos la reserva del usuario
        await axios.post(
          `${URL}/booking/${this.offerId}`,
          {},
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        // Imprimimos por pantalla el resultado exitoso
        Swal.fire({
          title: "¡Reserva creada!",
          text: "Has reservado una plaza para esta oferta",
          icon: "success",
          confirmButtonText: "Ok",
        });

        this.booking = false;
      } catch (error) {
        console.log(error.response.data.message, error.response.status);
      }
    },
    async deleteBooking() {
      try {
        // Recuperamos del localstorage el token y el id del usuario
        const userId = getUserId();
        const token = getAuthToken();

        await axios.delete(`${URL}/booking/${this.offerId}/user/${userId}`, {
          headers: { authorization: `Bearer ${token}` },
        });

        // Imprimimos por pantalla el resultado exitoso
        Swal.fire({
          title: "¡Reserva eliminada!",
          text: "Tu reserva ha sido cancelada con éxito",
          icon: "success",
          confirmButtonText: "Ok",
        });

        this.booking = true;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async checkRole() {
      // Obtenemos el rol del usuario
      const role = getRole();
      console.log(role);
      if (role) {
        this.role = role;
      }
    },
    async archive() {
      try {
        const result = await api.archiveOffer(this.offerId);

        Swal.fire({
          title: "¡Oferta archivada!",
          text: `Tu reserva ha sido archivada con resultado ${result}`,
          icon: "success",
          confirmButtonText: "Ok",
        });

        const results = await api.checkOfferStatus(this.offerId);
        this.status = results;
      } catch (error) {
        console.log(error);
      }
    },
    edit() {
      this.$router.push({
        name: "NewOfferView",
        params: { mode: "edit", offerId: this.offerId },
      });
    },
    // Cambia el estado de la oferta a publicada
    async publish() {
      try {
        await api.setOfferStatus(1, this.offerId);

        Swal.fire({
          title: "¡Oferta publicada!",
          text: `Enhorabuena!! Has publicado tu oferta con éxito`,
          icon: "success",
          confirmButtonText: "Ok",
        });

        const results = await api.checkOfferStatus(this.offerId);
        this.status = results;
      } catch (error) {
        console.log(error);
      }
    },
  },
  beforeCreate() {
    console.log("Antes de crear el componente (beforeCreate)");
  },
  async created() {
    // Recogemos el id de la oferta
    this.offerId = this.$route.params.id;

    // Comprobamos el rol del usuario para renderizar los CTAs
    // en consecuencia
    await this.checkRole();

    // Obtenemos los datos de la oferta especificada
    await this.getDataOffer();

    this.visible = true;

    console.log("Se ha creado el componente");
  },
  destroyed() {
    console.log("El componente se ha destruido");
  },
};
</script>

<style scoped>
.blank {
  height: 66px;
}

.offer-view {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  display: flex;
}

main button {
  margin: 2rem;
}
.provider {
  width: 200px;
}

.offer {
  border: 0.7px solid lightgrey;
  margin: 2rem;
}

.offer p:last-of-type {
  font-size: 20px;
  margin-top: 2rem;
}

.customer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footerapp {
  width: 100%;
  text-align: center;
}
</style>
