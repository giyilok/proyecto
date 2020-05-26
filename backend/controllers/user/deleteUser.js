'use strict';

const { generateError } = require('../../util/helpers');

const { getConnection } = require('../../dbsql');

// Borra un usuario, solo puede hacerlo el administrador
// Ruta Delete /user/:id
async function deleteUser(req, res, next) {
  let connection;

  try {
    const { id } = req.params;

    connection = await getConnection();

    const sqlQuery =
      'UPDATE user SET statusx = ? WHERE user_id = ? AND NOT statusx = -1';
    const [result] = await connection.query(sqlQuery, [-1, id]);

    if (!result.affectedRows) {
      throw generateError(
        `El usuario con id ${id} no exite en la base de datos`,
        404
      );
    }

    res.json({ status: 'ok', message: 'Usuario borrado' });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteUser;
