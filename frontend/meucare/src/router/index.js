import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Landing",
    component: () => import("../views/Landing.vue"),
    /* meta: {
      // Ruta pública
      allowAnonymous: true,
    }, */
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    /* meta: {
      // Ruta pública
      allowAnonymous: true,
    }, */
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    /* meta: {
      // Ruta pública
      allowAnonymous: true,
    }, */
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    /* meta: {
      // Ruta pública
      allowAnonymous: true,
    }, */
  },
  {
    path: "/offers",
    name: "Offers",
    component: () => import("../views/Offers.vue"),
    /* meta: {
      // Ruta pública
      allowAnonymous: true,
    }, */
  },
  {
    path: "*",
    name: "ErrorNotFound",
    component: () => import("../views/ErrorNotFound.vue"),
    /* meta: {
      // Ruta pública
      allowAnonymous: true,
    }, */
  },
];

const router = new VueRouter({
  routes,
});

export default router;
