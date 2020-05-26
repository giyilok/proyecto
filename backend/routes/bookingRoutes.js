'use strict';

const express = require('express');

// Imports de los controladores
const newBooking = require('../controllers/booking/newBooking');
const getUsersByOffer = require('../controllers/booking/getUsersByOffer');
const getBookingByUser = require('../controllers/booking/getBookingByUser');
const deleteBooking = require('../controllers/booking/deleteBooking');

// Imports middlewares
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { authRole } = require('../middlewares/checkRole');
const checkUser = require('../middlewares/checkUser');
const checkOffer = require('../middlewares/checkOffer');
const checkOfferSimple = require('../middlewares/checkOfferSimple');

// Creamos el router
const router = express.Router();

// Rutas de proveedor
router.post(
  '/:offerId',
  ensureAuthenticated,
  authRole(1),
  checkUser,
  checkOffer,
  newBooking
); // Realiza una reserva de la oferta especificada
router.get(
  '/users/offer/:offerId',
  ensureAuthenticated,
  authRole(2, 3),
  checkUser,
  checkOfferSimple,
  getUsersByOffer
); // Devuelve los usuarios que tienen reservada la oferta especificada
router.get(
  '/user/:userId',
  ensureAuthenticated,
  authRole(1, 3),
  checkUser,
  getBookingByUser
); // Devuelve las reservas del usuario especificado
router.delete(
  '/:bookingId',
  ensureAuthenticated,
  authRole(1, 3),
  checkUser,
  deleteBooking
); // Borra la reserva especificada

module.exports = router;
