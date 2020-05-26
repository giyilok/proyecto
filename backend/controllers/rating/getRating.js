'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Obtiene los ratings y comentarios del proveedor especificado
// Ruta /rating/:providerId  Método GET
async function getRating(req, res, next) {
  let connection;

  try {
    const providerId = req.params.providerId;

    connection = await getConnection();

    // Comprobamos si existe el proveedor
    const sqlQuery = 'SELECT role FROM user WHERE user_id = ? AND statusx = 1';
    const [dbProvider] = await connection.query(sqlQuery, [providerId]);

    if (!dbProvider.length) {
      throw generateError(
        `No existe ningún provedor activo con el id ${providerId} en la base de datos`,
        404
      );
    }

    // Buscamos en la db todos los ratings y comentarios del proveedor especificado
    const sqlQueryRating = 'SELECT * FROM rating WHERE provider_id = ?';
    const [resultsRating] = await connection.query(sqlQueryRating, [
      providerId
    ]);

    if (!resultsRating.length) {
      throw generateError(
        'No existe ninguna valoración o comentario de este proveedor.',
        404
      );
    }

    res.json({
      status: 'ok',
      message: 'Datos obtenidos con éxito',
      data: resultsRating
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getRating;
