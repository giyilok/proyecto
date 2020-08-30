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

  // Reservas
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

  // Ofertas
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
