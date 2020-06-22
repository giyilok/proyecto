<template>
  <div class="offer-card">
    <div class="provider">
      <img :src="offer.image" alt="avatar" />
      <h3>{{ offer.user_name }} {{ offer.last_name }}</h3>
      <p>Rating</p>
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
      <p>¡Solo queda 1 plaza!</p>
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
</template>

<script>
import IconifyIcon from "@iconify/vue";
import iAmbulance from "@iconify/icons-medical-icon/i-ambulance";
import iInpatient from "@iconify/icons-medical-icon//i-inpatient";

export default {
  name: "OfferCardFront",
  components: {
    IconifyIcon,
  },
  data() {
    return {
      icons: {
        iAmbulance,
        iInpatient,
      },
    };
  },
  props: {
    offer: Object,
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
  background: #f1eeee;
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
  background: #e4acf8;
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
</style>
