'use strict';

const { getConnection } = require('../../dbsql');
const { generateError, sendEmail } = require('../../util/helpers');

// Borra la reserva de la oferta especificada del usuario especificado
// Ruta /:offerId/user/:userId Método DELETE
async function deleteBookingByUser(req, res, next) {
  let connection;

  try {
    const { offerId, userId } = req.params;

    connection = await getConnection();

    // Comprobar que la reserva existe
    const sqlQuery = 'SELECT * FROM booking WHERE offer_id = ? AND user_id = ?';
    const [results] = await connection.query(sqlQuery, [offerId, userId]);

    if (!results.length) {
      throw generateError(
        `El usuario id ${userId} no tiene ninguna reserva de la oferta ${offerId}`,
        404
      );
    }

    // Obtener los datos de la oferta a la que corresponde
    const sqlQueryOffer = `SELECT o.statusx, u.user_name, u.last_name, u.email, b.booking_id FROM offer o
                        JOIN booking b ON b.offer_id = o.offer_id
                        JOIN user u ON u.user_id = b.user_id
                        WHERE o.offer_id = ? AND u.user_id = ?`;
    const [resultsOffer] = await connection.query(sqlQueryOffer, [
      offerId,
      userId
    ]);

    const {
      statusx,
      user_name,
      last_name,
      email,
      booking_id
    } = resultsOffer[0];

    // Si la oferta no está en statusx =1 (publicada) lanzamos un error
    if (statusx !== 1) {
      throw generateError(
        'Error solo se pueden anular reservas de ofertas que aún no estén activadas',
        400
      );
    }

    // Si todo fue bien anulamos la reserva y lo notificamos
    const sqlQueryDelete = 'DELETE FROM booking WHERE booking_id = ?';
    const [resultDelete] = await connection.query(sqlQueryDelete, [booking_id]);

    if (!resultDelete.affectedRows) {
      throw generateError('Error. No se pudo anular la reserva', 500);
    }

    // Mandamos mail con la nortificación de la baja
    try {
      await sendEmail({
        email: email,
        title: 'Anulación de reserva en MeuCare',
        content: `Estimado ${user_name} ${last_name}:\n\nConfirmamos la anulación de su reserva nº ${booking_id}`
      });
    } catch (error) {
      throw new Error(
        'Error en el envío del mail. Inténtelo de nuevo más tarde'
      );
    }

    // Devolvemos los resultados
    res.status(200).json({
      status: 'ok',
      message:
        'Reserva anulada. Le hemos enviado un correo confirmando la cancelación'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteBookingByUser;
