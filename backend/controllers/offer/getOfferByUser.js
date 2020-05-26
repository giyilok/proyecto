'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Devuelve las ofertas de un usuario activas o reservadas
// por orden ascendente de antiguedad
// Ruta /offer/user/:userId
async function getOfferByUser(req, res, next) {
  let connection;

  try {
    const { userId } = req.params;

    connection = await getConnection();

    const sqlQuery = `SELECT * from offer o
                         JOIN booking b ON b.offer_id = o.offer_id 
                         WHERE b.user_id = ?`;

    const [results] = await connection.query(sqlQuery, [userId]);

    // Comprobar si hay resultados
    if (!results.length) {
      throw generateError('No tienes ninguna oferta', 404);
    }

    // Si todo va bien devolver los datos
    res.status(200).json({
      statust: 'ok',
      message: `Ofertas del usuario ${userId}`,
      data: results
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getOfferByUser;
