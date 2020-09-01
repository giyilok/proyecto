"use strict";

import axios from "axios";
import { getAuthToken } from "@/utils/utils";

const token = getAuthToken();
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BACKEND_URL,
});

export default {
  login: async function(username, password) {
    const response = await instance.post("token/", { username, password });
    this.setToken(response.data.access);
    return response.data;
  },

  /********  Reservas   ******/

  checkBookingByUser: async function(offerId, userId) {
    const token = getAuthToken();
    this.setToken(token);

    const response = await instance.get(
      `/booking/check/${userId}/offer/${offerId}`
    );

    return response.data.bookingExists;
  },
  offerHasBooking: async function(offerId) {
    try {
      const response = await instance.get(`/booking/offer/${offerId}`);

      const booking = response.data.booking;

      return booking;
    } catch (error) {
      console.log(error);
    }
  },

  /*****  Ofertas *****/

  // Obtiene la info de la oferta especificada
  getOffer: async function(offerId) {
    try {
      const response = await instance.get(`/offer/${offerId}`);

      return response.data.data;
    } catch (error) {}
  },
  archiveOffer: async function(offerId) {
    try {
      const response = await this.setOfferStatus(3, offerId);

      return response;
    } catch (error) {
      console.log(error);
    }
  },

  setOfferStatus: async function(statusx, offerId) {
    try {
      this.setToken(token);

      const response = await instance.put(
        `/offer/set/${statusx}/offer/${offerId}`
      );

      return response.data;
    } catch (error) {
      console.log(error.response.message);
    }
  },
  checkOfferStatus: async function(offerId) {
    try {
      const response = await instance.get(`/offer/${offerId}`);

      return response.data.data.statusx;
    } catch (error) {
      console.log(error.response.message);
    }
  },

  // Devuelve las categorías, disponibilidades y features de
  // la oferta especificada en el objeto offerItems
  getOfferItems: async function(offerId) {
    /* const categories = await this.getCategories(offerId);
    const availabilities = await this.getAvailabilities(offerId);
    const features = await this.getFeatures(offerId); */
    const categories = await this.getItemsArray(`/category/${offerId}`);
    const availabilities = await this.getItemsArray(`/availability/${offerId}`);
    const features = await this.getItemsArray(`/feature/${offerId}`);
    const offerItems = { categories, availabilities, features };
    console.log("El objeto de arrays de items", offerItems);
    return offerItems;
  },
  // Obtiene la lista de elementos según la ruta que se le pase
  getItemsArray: async function(endpoint) {
    let arr = [];
    try {
      const response = await instance.get(endpoint);
      arr = response.data.data;
      return arr;
    } catch (error) {
      console.log(error.response.data.message);
      return arr;
    }
  },

  // Obtiene las categorías de la oferta especificada
  getCategories: async function(offerId) {
    let arr = [];
    try {
      const response = await instance.get(`/category/${offerId}`);
      arr = response.data.data;
      return arr;
    } catch (error) {
      console.log(error.response.data.message);
      return arr;
    }
  },
  // Obtiene las disponibilidades de la oferta especificada
  getAvailabilities: async function(offerId) {
    let arr = [];
    try {
      const response = await instance.get(`/availability/${offerId}`);
      arr = [];
    } catch (error) {
      console.log(error.response.data.message);
      return arr;
    }
  },
  // Obtiene las features de la oferta especificada
  getFeatures: async function(offerId) {
    let arr = [];
    try {
      const response = await instance.get(`/feature/${offerId}`);
      arr = response.data.data;
      return arr;
    } catch (error) {
      console.log(error.response.data.message);
      return arr;
    }
  },
  // Código de prueba
  setToken: (token) => {
    instance.defaults.headers.common["Authorization"] = "Bearer " + token;
  },

  logout: () => {
    delete instance.defaults.headers.common["Authorization"];
  },

  getProducts: () => {
    return instance.get("products/").then((response) => {
      return response.data;
    });
  },
  getProduct: (id) => {
    return instance.get("products/" + id + "/").then((response) => {
      return response.data;
    });
  },
  addProduct: (product) => {
    return instance.post("products/", product);
  },
  deleteProduct: (product) => {
    return instance.delete("products/" + product.id + "/", product);
  },
  updatePrice: (product, newPrice) => {
    return instance.patch("products/" + product.id + "/", {
      price: newPrice,
    });
  },
  updateQuantity: (product, newQuantity) => {
    return instance.patch("products/" + product.id + "/", {
      quantity: newQuantity,
    });
  },
};
