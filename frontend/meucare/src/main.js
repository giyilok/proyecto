import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vueHeadful from "vue-headful";

Vue.config.productionTip = false;

//Componentes
Vue.component("vue-headful", vueHeadful);

//Filtros
Vue.filter("capitalize", function(string) {
  let [firstCharacter, ...restCharacter] = string;
  return firstCharacter.toUpperCase() + restCharacter.join("");
});

//Instancia de Vue
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
