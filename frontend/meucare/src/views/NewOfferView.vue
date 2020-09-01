<template>
  <div class="upload-offer">
    <!--  Título de la pestaña -->
    <div>
      <vue-headful title="Nueva oferta" description="Crear nueva oferta" />
    </div>
    <!--  Título de la pestaña -->

    <!--  Menú de navegación  -->
    <menuapp></menuapp>
    <!--  Menú de navegación  -->

    <div class="blank"></div>

    <!--  Contenido de la vista  -->
    <main>
      <h1 v-if="modeIsCreate">Crea una nueva oferta de servicios en 3 minutos</h1>
      <h1 v-else>Edita tu oferta en solo 2.5 minutos</h1>
      <form>
        <div class="input-container">
          <div class="offer-text">
            <label for="title">Título de la oferta</label>
            <input
              type="text"
              id="title"
              placeholder="Escribe el título de la oferta"
              required
              v-model="title"
              autofocus
            />

            <label for="description">Describe los detalles de la oferta</label>
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="5"
              placeholder="Introduce los detalles de la oferta"
              required
              v-model="description"
            ></textarea>

            <label for="city">¿Dónde se realizará el servicio?</label>
            <select name="city" id="city" required v-model="selectedCity">
              <option selected disabled value>Escoje una localidad</option>
              <option
                v-for="city in cities"
                :key="city.city_id"
                :value="city.city_name"
              >{{ city.city_name }}</option>
            </select>

            <label for="feature">Añadir características del servicio</label>
            <div class="select-ctn">
              <select name="feature" id="feature" v-model="selectedFeature">
                <option disabled value>Escoje alguna feature</option>
                <option
                  v-for="feature in features"
                  :key="feature.feature_id"
                  :value="feature"
                  required
                >{{ feature.feature_name }}</option>
              </select>
              <button @click.prevent="addFeature">Añadir</button>
            </div>
            <p class="error-select" v-show="emptySelect">Debes seleccionar alguna opción para añadir</p>

            <p class="error-select" v-show="repeatedSelect">Ya existe esta opción</p>

            <div class="features list">
              <ul>
                <li v-for="(feature, index) in featuresList" :key="feature.id">
                  {{ feature.feature_name }}
                  <button @click.prevent="deleteFeature(index)">Eliminar</button>
                </li>
              </ul>
            </div>
          </div>

          <div class="offer-selections">
            <label for="category">Indica alguna categoría</label>
            <div class="select-ctn">
              <select name="category" id="category" v-model="selectedCategory">
                <option disabled value>Escoje una categoría de servicio</option>
                <option
                  v-for="category in categories"
                  :key="category.category_id"
                  :value="category"
                  required
                >{{ category.category_name }}</option>
              </select>
              <button @click.prevent="addCategory">Añadir</button>
            </div>

            <p
              class="error-select"
              v-show="emptySelectCategory"
            >Debes seleccionar alguna opción para añadir</p>

            <p class="error-select" v-show="repeatedSelectCategory">Ya existe esta opción</p>

            <div class="categories">
              <ul>
                <li v-for="(category, index) in categoriesList" :key="category.id">
                  {{ category.category_name }}
                  <button
                    @click.prevent="deleteCategory(index)"
                  >Eliminar</button>
                </li>
              </ul>
            </div>

            <label for="availability">Indica los horarios disponibles</label>
            <div class="select-ctn">
              <select name="availavility" id="availability" v-model="selectedAvailability">
                <option disabled value>Escoje un horario para el servicio</option>
                <option
                  v-for="availability in availabilities"
                  :key="availability.availability_id"
                  :value="availability"
                  required
                >{{ availability.av_name }}</option>
              </select>
              <button @click.prevent="addAvailability">Añadir</button>
            </div>

            <p
              class="error-select"
              v-show="emptySelectAvailability"
            >Debes seleccionar alguna opción para añadir</p>

            <p class="error-select" v-show="repeatedSelectAvailability">Ya existe esta opción</p>

            <div class="availabilities">
              <ul>
                <li v-for="(availability, index) in availabilitiesList" :key="availability.id">
                  {{ availability.av_name }}
                  <button
                    @click.prevent="deleteAvailability(index)"
                  >Eliminar</button>
                </li>
              </ul>
            </div>

            <p>Número máximo y mínimo de usuarios para que la oferta se active</p>
            <div class="users-min-max">
              <label for="usersmin">
                Mínimo
                <input type="number" id="usersMin" required v-model="usersMin" />
              </label>

              <label for="usersMax">
                Máximo
                <input type="number" id="usersMax" required v-model="usersMax" />
              </label>
            </div>
          </div>

          <div class="offer-price">
            <label for="price">Introduce el precio para el servicio</label>
            <div class="price-data">
              <input type="number" min="5" max="3000" step="5" placeholder="20" v-model="price" />€
              <select v-model="period">
                <!-- <option disabled>Seleccione un período</option> -->
                <option value="hora">Hora</option>
                <option value="día">Día</option>
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
              </select>
            </div>
          </div>
        </div>

        <section class="buttons">
          <button class="button-secondary" @click.prevent="goBack">Volver</button>
          <button v-if="modeIsCreate" class="button-primary" @click.prevent="saveOffer()">Guardar</button>
          <button v-else class="button-primary" @click.prevent="editOffer()">Modificar</button>
        </section>
      </form>
    </main>
    <!--  Contenido de la vista  -->

    <!-- Footer -->
    <footerapp class="footerapp"></footerapp>
    <!-- Footer -->
  </div>
</template>

<script>
import axios from "axios";
import { getAuthToken, getUserId } from "../utils/utils";
import Swal from "sweetalert2";
import menuapp from "../components/MenuApp";
import footerapp from "../components/FooterApp";
import { URL } from "../config";
import api from "@/api/api";

export default {
  name: "NewOfferView",
  components: {
    menuapp,
    footerapp,
  },
  data() {
    return {
      title: "",
      description: "",
      selectedCity: "",
      cities: [],
      selectedCategory: "",
      categories: [],
      categoriesList: [],
      selectedAvailability: "",
      availabilities: [],
      availabilitiesList: [],
      usersMin: 0,
      usersMax: 0,
      selectedFeature: null,
      features: [],
      featuresList: [],
      emptySelect: false,
      repeatedSelect: false,
      emptySelectCategory: false,
      repeatedSelectCategory: false,
      emptySelectAvailability: false,
      repeatedSelectAvailability: false,
      price: 0,
      period: null,
      mode: "create",
      offerId: null,
    };
  },
  computed: {
    modeIsCreate() {
      if (this.mode === "create") {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    // En modo edición obtiene los datos de la oferta y
    // los muestra para su edición
    async getDataOffer() {
      const offerInfo = await this.getOfferInfo();
      const items = await this.getItems();

      this.title = offerInfo.title;
      this.description = offerInfo.description;
      this.selectedCity = offerInfo.city_name;
      this.usersMin = offerInfo.customer_min;
      this.usersMax = offerInfo.customer_max;
      this.price = offerInfo.price;
      this.period = offerInfo.price_type;

      this.categoriesList = items.categories;
      this.availabilitiesList = items.availabilities;
      this.featuresList = items.features;
      /* if (items.features) {
        this.featuresList = items.features;
      } else {
        this.featuresList = []; */
    },

    async getOfferInfo() {
      try {
        // Obtenemos los datos de la oferta con el id especificado
        const response = await api.getOffer(this.offerId);
        console.log("Datos de la oferta", response);
        return response;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async getItems() {
      try {
        const response = await api.getOfferItems(this.offerId);
        console.log("Los Items", response);
        return response;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async getCategories() {
      try {
        const results = await axios.get(`${URL}/category`);
        return (this.categories = results.data.data);
      } catch (error) {
        console.log(error);
      }
    },
    async getAvailabilities() {
      try {
        const results = await axios.get(`${URL}/availability`);
        this.availabilities = results.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getCities() {
      try {
        const response = await axios.get(`${URL}/city/`);
        this.cities = response.data.cities;
      } catch (error) {
        console.log(error);
      }
    },
    async getFeatures() {
      try {
        const response = await axios.get(`${URL}/feature/`);
        this.features = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    addFeature() {
      this.emptySelect = false;

      if (!this.selectedFeature) {
        return (this.emptySelect = true);
      }

      if (this.featuresList.includes(this.selectedFeature)) {
        this.repeatedSelect = true;
      } else {
        this.repeatedSelect = false;
        this.featuresList.unshift(this.selectedFeature);
      }
    },
    addCategory() {
      this.emptySelectCategory = false;

      if (!this.selectedCategory) {
        return (this.emptySelectCategory = true);
      }

      if (this.categoriesList.includes(this.selectedCategory)) {
        this.repeatedSelectCategory = true;
      } else {
        this.repeatedSelectCategory = false;
        this.categoriesList.unshift(this.selectedCategory);
      }
    },
    addAvailability() {
      this.emptySelectAvailability = false;

      if (!this.selectedAvailability) {
        return (this.emptySelectAvailability = true);
      }

      if (this.availabilitiesList.includes(this.selectedAvailability)) {
        this.repeatedSelectAvailability = true;
      } else {
        this.repeatedSelectAvailability = false;
        this.availabilitiesList.unshift(this.selectedAvailability);
      }
    },
    deleteFeature(index) {
      this.featuresList.splice(index, 1);
      console.log(this.featuresList);
    },
    deleteCategory(index) {
      this.categoriesList.splice(index, 1);
      console.log(this.categoriesList);
    },
    deleteAvailability(index) {
      this.availabilitiesList.splice(index, 1);
      console.log(this.availabilities);
    },
    // TODO Antes de hacer la petición comprobar si no hay
    // ningún campo vacío
    async saveOffer() {
      const token = getAuthToken();
      const userId = getUserId();

      try {
        console.log("Hacemos la petición");
        await axios.post(
          "http://localhost:3001/offer/",
          {
            provider_id: userId,
            city_name: this.selectedCity,
            title: this.title,
            description: this.description,
            customer_min: this.usersMin,
            customer_max: this.usersMax,
            price: this.price,
            price_type: this.period,
            categories: this.categoriesList,
            availabilities: this.availabilitiesList,
            features: this.featuresList,
          },
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        // Mostramos modal indicando el registro correcto de la nueva oferta
        Swal.fire({
          title: "Oferta creada!",
          text: "Consulta tus ofertas o borradores para publicar o archivar",
          icon: "success",
          confirmButtonText: "Ok",
        });

        // Borramos los campos
        //this.emptyFields();
      } catch (error) {
        if ((error.response.status === 409) | (error.response.status === 400)) {
          console.log(error);

          // Mostramos modal con el error
          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "Ok",
          });
        } else {
          // Si es cualquier otro error lo muestra por consola
          console.log(error.response, "Hay un error");
        }
      }
    },

    async editOffer() {
      const token = getAuthToken();
      const userId = getUserId();
      console.log("Lista de features antes de modificar", this.featuresList);

      try {
        await axios.put(
          `http://localhost:3001/offer/${this.offerId}`,
          {
            city_name: this.selectedCity,
            title: this.title,
            description: this.description,
            customer_min: this.usersMin,
            customer_max: this.usersMax,
            price: this.price,
            price_type: this.period,
            categories: this.categoriesList,
            availabilities: this.availabilitiesList,
            features: this.featuresList,
          },
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        // Mostramos modal indicando el registro correcto de la nueva oferta
        Swal.fire({
          title: "Oferta modificada!",
          text: "La oferta ha sido modificada con éxito",
          icon: "success",
          confirmButtonText: "Ok",
        });

        this.$router.go(-1);
        // Borramos los campos
        //this.emptyFields();
      } catch (error) {
        if ((error.response.status === 409) | (error.response.status === 400)) {
          console.log(error);

          // Mostramos modal con el error
          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "Ok",
          });
        } else {
          // Si es cualquier otro error lo muestra por consola
          console.log(error.response.data.message, "Hay un error");
        }
      }
    },
    // Carga los datos de los selects para la oferta
    dataLoad() {
      this.getCategories();
      this.getAvailabilities();
      this.getCities();
      this.getFeatures();
    },
    goBack() {
      this.$router.go(-1);
    },
  },

  created() {
    this.dataLoad();

    // Si viene redireccionada de otra vista con parámetros (modo edición)
    if (this.$route.params.mode) {
      this.mode = this.$route.params.mode;
      this.offerId = this.$route.params.offerId;

      console.log(this.mode, this.offerId);
      //Obtenemos los datos de la oferta para editar
      this.getDataOffer();
    }
  },
};
</script>

<style scoped>
.blank {
  height: 66px;
}

.upload-offer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

main {
  flex: 1;
  max-width: 35%;
  margin-bottom: 2rem;
}

form {
  margin-top: 2rem;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.offer-text,
.offer-selections,
.offer-price {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-select {
  color: red;
}

.users-min-max {
  display: flex;
}

.select-ctn {
  display: flex;
  justify-content: space-between;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;
}

.footerapp {
  width: 100%;
  text-align: center;
}
</style>
