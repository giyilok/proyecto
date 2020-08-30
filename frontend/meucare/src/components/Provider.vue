<template>
  <div class="provider">
    <img :src="`http://localhost:3001/uploads/${providerInfo.image}`" alt="avatar" />
    <h3>{{ providerInfo.user_name }} {{ providerInfo.last_name }}</h3>
    <StarRating v-model="rating" :read-only="true" :increment="1" :star-size="starsize"></StarRating>
    <p>{{ providerInfo.xp_years }} años de experiencia</p>
    <p>{{ providerInfo.biography }}</p>
    <p>{{ providerInfo.speciality }}</p>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
  name: "Provider",
  components: {
    StarRating,
  },
  data() {
    return {
      starsize: 18,
      rating: null,
    };
  },
  props: {
    providerInfo: Object,
  },
  methods: {},
  created() {
    this.rating = Number(this.providerInfo.score_avg);
  },
};
</script>

<style scoped>
.provider {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem;
  border: 0.7px solid lightgrey;
}

img {
  width: 100px;
  border-radius: 50%;
  margin: 1rem auto;
}
</style>