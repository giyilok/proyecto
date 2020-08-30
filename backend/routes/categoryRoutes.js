'use strict';

const express = require('express');

// Imports de los controladores
const getCategories = require('../controllers/category/getCategories');
const newCategory = require('../controllers/category/newCategory');
const deleteCategory = require('../controllers/category/deleteCategory');
const editCategory = require('../controllers/category/editCategory');
const newCategoryOffer = require('../controllers/category/newCategoryOffer');
const deleteCategoryOffer = require('../controllers/category/deleteCategoryOffer');
const getCategoriesByOfferId = require('../controllers/category/getCategoriesByOfferId');

// Imports middlewares
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { authRole } = require('../middlewares/checkRole');

// Creamos el router
const router = express.Router();

// Rutas de proveedor
router.get('/', getCategories); // Ruta que devuelve las categorías de la base de datos
router.get('/:offerId', getCategoriesByOfferId); // Ruta que devuelve las categorías de la oferta especificada
router.post('/', ensureAuthenticated, authRole(3), newCategory); // Ruta para añadir nuevas categorías. Solo el admin.
router.delete('/:categoryId', ensureAuthenticated, authRole(3), deleteCategory); // Ruta para añadir nuevas categorías. Solo el admin.
router.put('/:categoryId', ensureAuthenticated, authRole(3), editCategory); // Ruta editar las categorías. Solo el admin.
router.post(
  '/:categoryId/offer/:offerId',
  ensureAuthenticated,
  authRole(2, 3),
  newCategoryOffer
); // Añade una categoría a la oferta especificada
router.delete('/:categoryId', ensureAuthenticated, authRole(3), editCategory); // Borra la categoría especificada. Solo el admin.
router.delete(
  '/:categoryId/offer/:offerId',
  ensureAuthenticated,
  authRole(3),
  deleteCategoryOffer
); // Borra la categoría de la oferta

module.exports = router;
