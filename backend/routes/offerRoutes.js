'use strict';

const express = require('express');

// Imports de los controladores
const getOffers = require('../controllers/offer/getOffers');
const getRandomOffer = require('../controllers/offer/getRandomOffer');
const newOffer = require('../controllers/offer/newOffer');
const searchOffer = require('../controllers/offer/searchOffer');
const avancedSearchOffer = require('../controllers/offer/avancedSearchOffer');
const getOfferById = require('../controllers/offer/getOfferById');
const getRatedOffer = require('../controllers/offer/getRatedOffer');
const setOfferStatus = require('../controllers/offer/publishOffer');
const getOfferByUser = require('../controllers/offer/getOfferByUser');
const getOfferByProvider = require('../controllers/offer/getOfferByProvider');
const editOffer = require('../controllers/offer/editOffer');
const deleteOffer = require('../controllers/offer/deleteOffer');

// Imports middlewares
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { authRole } = require('../middlewares/checkRole');
const checkUser = require('../middlewares/checkUser');
const checkOffer = require('../middlewares/checkOffer');

// Creamos el router
const router = express.Router();

// Rutas de proveedor
router.get('/getoffers', getOffers);
router.get('/random/:limit', getRandomOffer); // Ruta que devuelve n ofertas aleatorias publicadas
router.post('/', ensureAuthenticated, authRole(2), newOffer); // Ruta para registrar una nueva oferta
router.get('/search/land', searchOffer); // Búsqueda general de la landing
router.get('/search', avancedSearchOffer); // Búsqueda avanzada
router.get('/:offerId', getOfferById); // Ruta que devuelve la oferta con el id especificado
router.get('/rated/:limit', getRatedOffer); // Devuelve las n ofertas aleatorias de entre las mejor valoradas (puntuación de 4 a 5)
router.put(
  '/set/:statusx/offer/:offerId',
  ensureAuthenticated,
  authRole(2),
  setOfferStatus
); // Cambia el estado de una una oferta a borrador, publicada o archivada
router.get(
  '/user/:id',
  ensureAuthenticated,
  authRole(1),
  checkUser,
  getOfferByUser
); // Devuelve las ofertas activas o no de un usuario por oden de antiguedad y estado
router.get('/provider/:id', checkUser, getOfferByProvider); // Devuelve todas las ofertas de un proveedor por orden de antiguedad y estado
router.put(
  '/:offerId',
  ensureAuthenticated,
  authRole(2, 3),
  checkOffer,
  editOffer
); // Actualiza una oferta según su estado actual (borrador, publicada, activada, archivada)
router.delete(
  '/:offerId',
  ensureAuthenticated,
  authRole(2, 3),
  checkOffer,
  deleteOffer
); // Borra una oferta (si su estado lo permite)

module.exports = router;
