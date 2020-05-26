'use strict';

const { getConnection } = require('../../dbsql');

const { generateError } = require('../../util/helpers');

// Obtiene la oferta con el id especificado
// Ruta /offer/:id Método GET
async function getOfferById(req, res, next) {
  let connection;

  try {
    const { offerId } = req.params;

    // Obtenemos la oferta
    connection = await getConnection();

    const sqlQuery = `SELECT * FROM offer o 
                        JOIN provider p ON o.provider_id = p.user_id
                        JOIN user u ON u.user_id = p.user_id
                        JOIN city ON o.city_id = city.city_id 
                        WHERE offer_id = ?`;

    const [offer] = await connection.query(sqlQuery, [offerId]);

    // Comprobamos si exite la oferta con ese id
    if (!offer.length) {
      throw generateError('La oferta solicitada no existe', 404);
    }

    // Si todo fue bien devolvemos la oferta
    const [payload] = offer;

    res.send({
      status: 'ok',
      message: `Oferta con id ${offerId} obtenida con éxito`,
      data: payload
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getOfferById;
