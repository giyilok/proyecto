'use strict';

const { getConnection } = require('../dbsql');
const { generateError } = require('../util/helpers');

// FIXME Mejorar la comprobación de propietarios
// Middleware para el control de ofertas.
async function checkOffer(req, res, next) {
  let connection;
  try {
    const { offerId } = req.params;

    connection = await getConnection();

    // Comprobamos que exista la oferta especificada
    // Seleccionar en la query los estados de la oferta que se
    // quieren dejar pasar con 'AND statusx NOT IN (3, 4)'
    const sqlQuery =
      'SELECT statusx, provider_id, customer_min FROM offer WHERE offer_id = ?';
    const [offerResults] = await connection.query(sqlQuery, [offerId]);
    const [offer] = offerResults;

    if (!offerResults.length) {
      throw generateError(
        `No existe ninguna oferta con el id ${offerId} en la base de datos`,
        404
      );
    }

    if (req.auth.role !== 1) {
      // Comprobamos que el usuario sea propietario de la oferta o el admin
      if (req.auth.id !== offer.provider_id && req.auth.role !== 3) {
        throw generateError('No tienes permisos para esta acción, 403');
      }
    }

    // Comprobamos cuántas reservas tiene la oferta
    const sqlQueryBooking =
      'SELECT COUNT(booking_id) AS offersCount FROM booking WHERE offer_id = ?';
    const [offersNumber] = await connection.query(sqlQueryBooking, [offerId]);
    const { offersCount } = offersNumber[0];

    // Añadimos a la request el estado de la oferta y el número de reservas
    // para para no tener que hacer una nueva consulta en el siguiente middleware
    req.claims = {
      statusx: offer.statusx,
      offersCount,
      customer_min: offer.customer_min
    };

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = checkOffer;
