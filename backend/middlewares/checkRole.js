'use strict';
const { generateError } = require('../util/helpers');

function checkRole(req, res, next, role) {
  if (!require.auth || require.auth.role !== role) {
    throw generateError('No tienes permisos para realizar esta acción, 401');
  }
}

function authRole(...roles) {
  function isAllowed(role) {
    return roles.indexOf(role) > -1;
  }

  return function (req, res, next) {
    if (req.auth && isAllowed(req.auth.role)) {
      next();
    } else {
      throw generateError('Acceso prohibido', 401);
    }
  };
}

module.exports = { authRole, checkRole };
