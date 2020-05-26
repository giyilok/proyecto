'use strict';

const express = require('express');

// Imports de los controladores
const getCities = require('../controllers/city/getCities');

// Imports middlewares

// Creamos el router
const router = express.Router();

// Rutas de proveedor
router.get('/', getCities); // Ruta que devuelve ciudades de la base de datos
module.exports = router;
