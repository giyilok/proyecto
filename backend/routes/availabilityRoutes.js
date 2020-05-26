'use strict';

const express = require('express');

// Imports de los controladores
const getAvailabilities = require('../controllers/availability/getAvailabilities');

// Imports middlewares

// Creamos el router
const router = express.Router();

// Rutas de proveedor
router.get('/', getAvailabilities); // Ruta que devuelve ciudades de la base de datos

module.exports = router;
