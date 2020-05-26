'use strict';

const express = require('express');

// Imports de los controladores
const getProvider = require('../controllers/provider/getProvider');
const newProvider = require('../controllers/provider/newProvider');
//const editProvider = require('../controllers/provider/editProvider');
//const deleteProvider = require('../controllers/provider/deleteProvider');
const offerActiveProvider = require('../controllers/provider/offerActiveProvider');

//const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
//const { authRole } = require('../middlewares/checkRole');

// Creamos el router
const router = express.Router();

// Rutas de proveedor
router.get('/active', offerActiveProvider); // Ruta que devuelve los proveedores con ofertas activas
router.get('/:id', getProvider); // Obtiene todos los datos del proveedor especificado
router.post('/', newProvider); // Graba en la db el proveedor con los datos proporcionados
//router.put('/:id', editProvider); // Edita y actualizada los datos del proveedor seleccionado
//router.delete(':id', deleteProvider); // Desactiva el proveedor indicado

module.exports = router;
