'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Devuelve los usuarios que tienen reservada la oferta especificada
// Ruta /booking/users/offer/:offerId Método GET
async function getUsersByOffer(req, res, next) {
  let connection;

  try {
    const { offerId } = req.params;

    connection = await getConnection();
    // Comprobar que el usuario existe(hecho con el middleware checkUser)
    // Comprobar que la oferta existe (hecho con el middleware checkOfferSimple)
    // Obtener el listado de usuarios que tengan reserva de la oferta especificada
    // en orden ascendente de inscripción
    const sqlQuery = `SELECT u.* FROM user u 
                        JOIN booking b ON b.user_id = u.user_id
                        JOIN offer o ON o.offer_id = b.offer_id
                        WHERE o.offer_ID = ? ORDER BY b.create_at ASC`;

    const [resultUsers] = await connection.query(sqlQuery, [offerId]);

    if (!resultUsers.length) {
      throw generateError(
        'No existe ningún usuario con reserva para esta oferta',
        404
      );
    }

    const payload = resultUsers;

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

module.exports = getUsersByOffer;
