<template>
  <div v-if="visible">
    <router-link :to="{ name: 'OfferView', params: { id: offer.offer_id }}">
      <div class="offer-card">
        <div class="provider">
          <img :src="`http://localhost:3001/uploads/${this.offer.image}`" alt="avatar" />
          <h3>{{ offer.user_name }} {{ offer.last_name }}</h3>
          <StarRating v-model="rating" :read-only="true" :increment="1" :star-size="starsize"></StarRating>

          <p>{{ offer.xp_years }} años de experiencia</p>
        </div>

        <div class="info-text">
          <h2>{{ offer.title }}</h2>
          <p>{{ offer.description }}</p>
          <div class="location-icon">
            <span>{{ offer.city_name }}</span>
            <div class="icon-container">
              <IconifyIcon class="icon" :icon="icons.iAmbulance" height="28" />
              <IconifyIcon class="icon" :icon="icons.iInpatient" height="28" />
            </div>
          </div>
        </div>

        <div class="price-rigth">
          <p>{{ message }}</p>
          <p class="price">
            {{
            offer.price
            .split(".")
            .slice(0, 1)
            .shift()
            }}€ / {{ offer.price_type }}
          </p>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import axios from "axios";
import IconifyIcon from "@iconify/vue";
import iAmbulance from "@iconify/icons-medical-icon/i-ambulance";
import iInpatient from "@iconify/icons-medical-icon//i-inpatient";
import StarRating from "vue-star-rating";
import { URL } from "../config";

export default {
  name: "OfferCardList",
  components: {
    IconifyIcon,
    StarRating,
  },
  data() {
    return {
      icons: {
        iAmbulance,
        iInpatient,
      },
      starsize: 18,
      rating: null,
      message: "",
    };
  },
  props: {
    offer: Object,
  },
  computed: {
    visible() {
      return this.rating != null;
    },
  },
  methods: {
    async checkBooking() {
      const response = await axios.get(
        `${URL}/booking/offer/${this.offer.offer_id}`
      );

      console.log(response);
      const booking = response.data.booking;
      console.log(booking);
      // Calculamos las plazas disponibles y mostramos el mensaje correspondiente
      const freeSlot = this.offer.customer_min - booking;

      if (freeSlot === 1) {
        this.message = `¡Solo queda ${freeSlot} plaza!`;
      } else {
        this.message = `Quedan ${freeSlot} plazas`;
      }
    },
    // TODO Decidir cómo realizar la navegación
    // Cuando se pulsa sobre una oferta manda emite el evento redirect
    // hacia el padre con id de la oferta como argumento
    /* goToOffer() {
      const offerId = this.offer.offer_id;

      this.$emit("redirect", offerId);
    }, */
  },
  created() {
    this.checkBooking();
    this.rating = Number(this.offer.score_avg);
  },
};
</script>

<style scoped>
.offer-card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border: 0.5px solid lightgrey;
  border-radius: 20px;
  max-width: 800px;
  height: 200px;
  margin: 10px 10px;
  background: #f9f9f9;
}

.provider {
  display: flex;
  flex-basis: 25%;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.provider h3 {
  font-size: 16px;
}

.provider p {
  font-size: 14px;
}

.info-text {
  flex-basis: 4%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: left;
  margin: 0 1rem;
}

.info-text h2 {
  font-size: 22px;
}

.location-icon {
  display: flex;
  justify-content: space-between;
  margin-right: 30px;
}
.icon-container {
  display: inline;
  margin-right: 30px;
}

.icon {
  display: inline-block;
  margin: 0 10px;
  color: black;
}

.price-rigth {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 1rem;
}

.price-rigth p {
  font-weight: bolder;
}

.price {
  border-radius: 12px;
  background: rgb(245, 168, 33);
  padding: 10px 18px;
}

img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

span {
  max-width: 180px;
  display: inline-block;
  text-align: left;
  margin: 2px;
}

span:first-child {
  font-weight: bolder;
}

a {
  text-decoration: none;
  color: black;
}
</style>
