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
      <h1>Crear oferta de servicios</h1>
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

            <label for="availability">Disponibilidad horaria</label>
            <select name="availability" id="availability" v-model="selectedAvailability">
              <option selected>Escoje el horario del servicio</option>
              <option
                v-for="availability in availabilities"
                :key="availability.availability_id"
                :value="availability.availability_id"
                required
              >{{ availability.av_name }}</option>
            </select>

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
          <button class="button-secondary">Volver</button>
          <button class="button-primary" @click.prevent="saveOffer()">Guardar</button>
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
      usersMin: 2,
      usersMax: 2,
      selectedFeature: null,
      features: [],
      featuresList: [],
      emptySelect: false,
      repeatedSelect: false,
      emptySelectCategory: false,
      repeatedSelectCategory: false,
      price: 0,
      period: "null",
    };
  },
  methods: {
    async getCategories() {
      try {
        const results = await axios.get(`${URL}/category`);
        this.categories = results.data.data;
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
    deleteFeature(index) {
      this.featuresList.splice(index, 1);
      console.log(this.featuresList);
    },
    deleteCategory(index) {
      this.categoriesList.splice(index, 1);
      console.log(this.categoriesList);
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
            availability_id: this.selectedAvailability,
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
        console.log("Aquí se saca el status");
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
          console.log(error), "Hay un error";
        }
      }
    },
  },
  created() {
    this.getCategories();
    this.getAvailabilities();
    this.getCities();
    this.getFeatures();
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
