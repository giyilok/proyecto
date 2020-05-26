'use strict';

const { getConnection } = require('../../dbsql');
const { generateError, sendEmail } = require('../../util/helpers');

// Borra la reserva especificada
// Ruta /:bookingId Métedo DELETE
async function deleteBooking(req, res, next) {
  let connection;

  try {
    const { bookingId } = req.params;

    connection = await getConnection();

    // Comprobar que la reserva existe
    const sqlQuery = 'SELECT user_id FROM booking WHERE booking_id = ?';
    const [results] = await connection.query(sqlQuery, [bookingId]);

    if (!results.length) {
      throw generateError(`La reserva con id ${bookingId} no existe`, 404);
    }

    const { user_id } = results[0];

    // Comprobamos que la reserva corresponde al usuario que quiere anularla
    // o es el administrador
    if (req.auth.id !== user_id && req.auth.role !== 3) {
      throw generateError('No tienes permisos para anular una reserva', 403);
    }

    // Obtener los datos de la oferta a la que corresponde
    const sqlQueryOffer = `SELECT o.statusx, u.user_name, u.last_name, u.email FROM offer o
                        JOIN booking b ON o.offer_id = b.offer_id
                        JOIN user u ON u.user_id = b.user_id
                        WHERE b.booking_id = ?`;
    const [resultsOffer] = await connection.query(sqlQueryOffer, [bookingId]);
    const { statusx, user_name, last_name, email } = resultsOffer[0];

    // Si la oferta no está en statusx =1 (publicada) lanzamos un error
    if (statusx !== 1) {
      throw generateError(
        'Error solo se pueden anular reservas de ofertas que aún no estén activadas',
        400
      );
    }

    // Si todo fue bien anulamos la reserva y lo notificamos
    const sqlQueryDelete = 'DELETE FROM booking WHERE booking_id = ?';
    const [resultDelete] = await connection.query(sqlQueryDelete, [bookingId]);

    if (!resultDelete.affectedRows) {
      throw generateError('Error. No se pudo anular la reserva', 500);
    }

    // Mandamos mail con la nortificación de la baja
    try {
      await sendEmail({
        email: email,
        title: 'Anulación de reserva en MeuCare',
        content: `Estimado ${user_name} ${last_name}:\n\nConfirmamos la anulación de su reserva nº ${bookingId}`
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

module.exports = deleteBooking;
