<template>
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
    <!-- Información de la oferta -->

    <!-- Botones -->
    <div v-if="isCustomer" class="customer">
      <button v-if="booking" class="button-primary" v-on:click.prevent="newBooking">Reservar</button>
      <button v-else class="button-primary" v-on:click.prevent="deleteBooking">Borrar reserva</button>
    </div>

    <div v-else>
      <button v-show="buttonVisible[0]" class="button-primary" @click="archive">Archivar</button>
      <button v-show="buttonVisible[1]" class="button-primary">Publicar</button>
      <button v-show="buttonVisible[2]" class="button-primary" @click="editar">Editar</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {},
  props: {
    offer: Object,
    categories: Array,
    availabilities: Array,
    features: Array,
  },
};
</script>

<style>
</style>