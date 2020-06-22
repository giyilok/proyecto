<template>
  <div class="offer-card">
    <img :src="offer.image" alt="avatar" />
    <p>
      <span>{{ offer.title }}</span> <span>en {{ offer.city_name }}</span>
    </p>

    <!-- TODO Poner los decimales al precio -->
    <p>
      {{
        offer.price
          .split(".")
          .slice(0, 1)
          .shift()
      }}€/{{ offer.price_type }}
    </p>
  </div>
</template>

<script>
export default {
  name: "OfferCardFront",
  props: {
    offer: Object,
  },
};
</script>

<style scoped>
.offer-card {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border: 0.5px solid lightgrey;
  border-radius: 20px;
  width: 390px;
  height: 110px;
  display: flex;
  margin: 10px 0;
  background: #f1eeee;
}

.offer-card p:last-child {
  border-out: 1px solid lightgray;
  padding: 3px;
  border-radius: 12px;
  background: #c4c4c4;
}

img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
}

span {
  max-width: 180px;
  display: block;
  text-align: left;
  margin: 2px;
}

span:first-child {
  font-weight: bolder;
}
</style>
