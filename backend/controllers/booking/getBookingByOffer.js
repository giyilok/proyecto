'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// TODO Meter los errores aquí
// Devuelve las reservas de la oferta especificada
// Ruta /booking/offer/:offerId Método GET
async function getBookingByOffer(req, res, next) {
  let connection;

  try {
    const { offerId } = req.params;

    connection = await getConnection();
    // Comprobar que la oferta existe (hecho con el middleware checkOfferSimple)

    // Obtener el número de reservas de la oferta especificada
    const sqlQuery = `SELECT count(b.booking_id) as reservas FROM booking b
                        JOIN offer o ON o.offer_id = b.offer_id
                        WHERE o.offer_ID = ?`;

    const [booking] = await connection.query(sqlQuery, [offerId]);

    const [payload] = booking;

    // Si todo va bien devolvemos los resultados
    res.status(200).json({
      status: 'ok',
      booking: payload
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBookingByOffer;
