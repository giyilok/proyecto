'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Devuelve todas las ofertas de un proveedor
// por orden de antiguedad y estado
// Ruta /offer/provider/:provider_id
async function getOfferByProvider(req, res, next) {
  let connection;

  try {
    const { providerId } = req.params;

    connection = await getConnection();

    const sqlQuery = `SELECT * from offer o
                         JOIN provider p ON o.provider_id = p.user_id 
                         WHERE p.user_id = ? ORDER BY o.create_at DESC, o.statusx DESC `;

    const [results] = await connection.query(sqlQuery, [providerId]);

    // Comprobar si hay resultados
    if (!results.length) {
      throw generateError('No tienes ninguna oferta', 404);
    }

    // Si todo va bien devolver los datos
    res.status(200).json({
      statust: 'ok',
      message: `Ofertas del proveedor ${providerId}`,
      data: results
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getOfferByProvider;
