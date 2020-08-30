'use strict';

const { getConnection } = require('../../dbsql');

//const { generateError } = require('../../util/helpers');

// Comprueba si existe reserva de un usuario para la
// oferta especificada
// Ruta /booking/check/:userId/offer/:offerId Método GET
async function checkBookingOfferByUser(req, res, next) {
  let connection;
  let bookingExists = false;

  try {
    const { offerId, userId } = req.params;

    connection = await getConnection();

    // Comprobar si el usario existe (hecho con el middleware checkUser)
    // Comprobar que la oferta existe (hecho con el middleware checkOffer)

    // Comprobar que no exista ninguna reserva previa de este usuario
    const sqlQuery = `SELECT booking_id FROM booking
                        WHERE offer_id = ? AND user_id = ?`;

    const [results] = await connection.query(sqlQuery, [offerId, userId]);

    // Si existe la reserva
    if (results.length) {
      bookingExists = true;
    }

    /* if (!results.length) {
      throw generateError(
        `No existe reserva de la oferta ${offerId} para el usuario ${userId}`,
        404
      );
    } */

    res.status(200).json({
      status: 'ok',
      message: 'Ya existe una reserva de este usuario para esta oferta',
      payload: results[0],
      bookingExists
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}
module.exports = checkBookingOfferByUser;
