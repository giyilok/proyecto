'use strict';

const jwt = require('jsonwebtoken');

//const { getConnection } = require('../dbsql');
const { generateError } = require('../util/helpers');

async function ensureAuthenticated(req, res, next) {
  let connection;

  try {
    // Comprobar si la cabecera de autorización es válida
    const { authorization } = req.headers;

    if (!authorization) {
      throw generateError('Falta la cabecera de autorización');
    }

    // Obtenemos el token
    const authorizationParts = authorization.split(' ');

    let token;

    if (authorizationParts.length === 1) {
      token = authorization;
    } else if (authorizationParts[0] === 'Bearer') {
      token = authorizationParts[1];
    } else {
      throw generateError('No puedo leer el token', 400);
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      throw new Error('El token no está bien formado', 400);
    }

    // FIXME Hay que arreglar esto
    /* // Comprobamos que la fecha del token sea mayor a la
    // fecha de última actualización de password de usuario
    const { id, iat } = decoded;

    connection = await getConnection();

    const sqlQuery = 'SELECT lastPasswordUpdate from users WHERE user_id = ?';
    const [result] = await connection.query(sqlQuery, [id]);

    if (!result.length) {
      throw generateError('El usuario no existe en la base de datos');
    }

    const [user] = result;

    // Ojo la fecha del iat está en segundos, pero en node las fechas
    // están en milisegundos
    if (new Date(iat * 1000) < new Date(user.lastPasswordUpdate)) {
      throw generateError('El token ya no es válido. Vuelve a hacer login');
    } */

    req.auth = decoded;
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = ensureAuthenticated;
