'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Devuelve las reservas del usuario especificado
// Ruta /booking/user/:userId
async function getBookingByUser(req, res, next) {
  let connection;

  try {
    const { userId } = req.params;

    connection = await getConnection();
    // Comprobar que el usuario existe(hecho con el middleware checkUser)
    // Obtener el listado de reservas para el usuario especificado
    // en orden ascendente de reserva
    const sqlQuery = `SELECT * FROM booking b
                        JOIN user u ON b.user_id = u.user_id
                        JOIN offer o ON o.offer_id = b.offer_id
                        WHERE u.user_id = ? 
                        ORDER BY b.create_at DESC`;

    const [resultBooking] = await connection.query(sqlQuery, [userId]);

    if (!resultBooking.length) {
      throw generateError(
        'No existe ningún usuario con reserva para esta oferta',
        404
      );
    }

    const payload = resultBooking;

    // Si todo va bien devolvemos los resultados
    res.status(200).json({
      status: 'ok',
      data: payload
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBookingByUser;
