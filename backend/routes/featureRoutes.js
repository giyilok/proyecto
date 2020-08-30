'use strict';

const express = require('express');

// Imports de los controladores
const getFeatures = require('../controllers/feature/getFeatures');
const getFeaturesByOfferId = require('../controllers/feature/getFeaturesByOfferId');
const newFeatureOffer = require('../controllers/feature/newFeatureOffer');

// Creamos el router
const router = express.Router();

// Rutas de proveedor
router.get('/', getFeatures); // Ruta que devuelve las features de la base de datos
router.get('/:offerId', getFeaturesByOfferId); // Ruta que devuelve las features de la oferta especificada
router.get('/:featureId/offer/:offerId', newFeatureOffer); // Ruta para grabar una feature para la oferta especificada

module.exports = router;
