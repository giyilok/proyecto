'use strict';

const express = require('express');

// Imports de los controladores
const ratingProvider = require('../controllers/rating/ratingProvider');
const getRating = require('../controllers/rating/getRating');
const editRating = require('../controllers/rating/editRating');
const deleteRating = require('../controllers/rating/deleteRating');

// Imports de middlewares de autentificación
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { authRole } = require('../middlewares/checkRole');
const checkUser = require('../middlewares/checkUser');

// Creamos el router
const router = express.Router();

// Rutas de proveedor
router.post(
  '/:providerId',
  ensureAuthenticated,
  authRole(1),
  checkUser,
  ratingProvider
); // Realiza un valoracion y/o comentario de proveedor especificado
router.get('/:providerId', getRating); // Obtiene los n ratings y/o comentarios del proveedor especificado
router.put(
  '/:providerId',
  ensureAuthenticated,
  authRole(1),
  checkUser,
  editRating
); // Edita la valoración y/o comentario del proveedor especidicado
router.delete(
  '/user/:user_id/provider/:provider_id',
  ensureAuthenticated,
  authRole(3),
  deleteRating
); // Borra la valoración y/o comentario del proveedor especificado solo el administrador puede borrar valoraciones y comentarios

module.exports = router;
