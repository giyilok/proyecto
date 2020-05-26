'use strict';

const { getConnection } = require('../../dbsql');

const { generateError } = require('../../util/helpers');

// Obtenemos las n ofertas aleatorias entre las mejor valoradas
// Se mostrarán solo las que tengan una valoración entre 4 y 5
// Ruta /offer/random?limit=5 por ejemplo
async function getRatedOffer(req, res, next) {
  let connection;

  try {
    const { limit } = req.params;

    connection = await getConnection();
    console.log(limit);

    const sqlQuery = `SELECT * FROM offer o 
      JOIN provider p ON o.provider_id = p.user_id 
      JOIN user ON user.user_id = p.user_id
      JOIN city c ON c.city_id = o.city_id 
      JOIN offer_category oc ON o.offer_id = oc.offer_id 
      WHERE o.statusx = 1 AND p.score_avg BETWEEN 4 AND 5 
      ORDER BY RAND() LIMIT ?`;

    const [result] = await connection.query(sqlQuery, [Number(limit)]);
    if (!result.length) {
      throw generateError(
        'No existe ninguna oferta publicada en estos momentos',
        401
      );
    }

    res.send({
      status: 'ok',
      data: result
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getRatedOffer;
