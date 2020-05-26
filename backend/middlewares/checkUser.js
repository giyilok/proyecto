'use strict';

const { getConnection } = require('../dbsql');
const { generateError } = require('../util/helpers');

// Middleware de control de usuario
// Comprueba si existe el usuario en la db
async function checkUser(req, res, next) {
  let connection;
  try {
    const { id } = req.auth;

    connection = await getConnection();

    // Buscamos en la db el usuario con los datos proporcionados
    const sqlQuery =
      'SELECT role FROM user WHERE user_id = ? AND statusx NOT IN (-1, 2)';
    const [dbUser] = await connection.query(sqlQuery, [id]);

    if (!dbUser.length) {
      throw generateError(
        `No existe ningún usuario activo con el id ${id} en la base de datos`,
        404
      );
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = checkUser;
