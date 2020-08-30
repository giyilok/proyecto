'use strict';

const { getConnection } = require('../../dbsql');

// Comprueba si una oferta tiene reservas
// Ruta /booking/offer/:offerId Método GET
async function getBookingByOffer(req, res, next) {
  let connection;

  try {
    const { offerId } = req.params;

    connection = await getConnection();

    // Obtener el número de reservas de la oferta especificada
    const sqlQuery = `SELECT count(b.booking_id) as reservas FROM booking b
                        JOIN offer o ON o.offer_id = b.offer_id
                        WHERE o.offer_id = ?`;

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
