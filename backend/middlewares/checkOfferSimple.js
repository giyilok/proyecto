'use strict';

const { getConnection } = require('../dbsql');
const { generateError } = require('../util/helpers');

// FIXME Mejorar la comprobación de propietarios
// Middleware para comprabar si la oferta existe
async function checkOfferSimple(req, res, next) {
  let connection;
  try {
    const { offerId } = req.params;

    connection = await getConnection();

    // Comprobamos que exista la oferta especificada
    // Seleccionar en la query los estados de la oferta que se
    // quieren dejar pasar con 'AND NOT IN (3, 4)
    const sqlQuery = 'SELECT statusx FROM offer WHERE offer_id = ?';
    const [offerResults] = await connection.query(sqlQuery, [offerId]);

    if (!offerResults.length) {
      throw generateError(
        `No existe ninguna oferta con el id ${offerId} en la base de datos`,
        404
      );
    }

    /* // Comprobamos que el usuario sea propietario de la oferta o el admin
    if (req.auth.id !== offer.provider_id && req.auth.role !== 3) {
      throw generateError('No tienes permisos para esta acción, 403');
    } */

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = checkOfferSimple;
