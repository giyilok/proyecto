'use strict';
// Enrutador para acciones de usuario
const express = require('express');

const getUser = require('../controllers/user/getUser');
const newUser = require('../controllers/user/newUser');
const activateUser = require('../controllers/user/activateUser');
const loginUser = require('../controllers/user/loginUser');
const editUser = require('../controllers/user/editUser');
const updateUserPassword = require('../controllers/user/updateUserPassword');
const deleteUser = require('../controllers/user/deleteUser');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { authRole } = require('../middlewares/checkRole');

const router = express.Router();

// Rutas
router.get('/activate', activateUser);
router.get('/:id', getUser);
router.post('/login', loginUser);
//router.post('/logout', logout);
router.post('/register', newUser);
router.put('/:id', ensureAuthenticated, authRole(1, 3), editUser);
router.delete('/:id', ensureAuthenticated, authRole(1), deleteUser);
router.post('/:id/password', ensureAuthenticated, updateUserPassword);

// Exportamos las rutas
module.exports = router;
