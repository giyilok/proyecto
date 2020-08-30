'use strict';

const express = require('express');

// Imports de los controladores
const getAvailabilities = require('../controllers/availability/getAvailabilities');
const getAvailabilitiesByOfferId = require('../controllers/availability/getAvailabilitiesByOfferId');

// Imports middlewares

// Creamos el router
const router = express.Router();

// Rutas de proveedor
router.get('/', getAvailabilities); // Ruta que devuelve las disponibilidades horarias de la base de datos
router.get('/:offerId', getAvailabilitiesByOfferId); // Ruta que devuelve las disponibilidades horarias de la oferta especificada

module.exports = router;
