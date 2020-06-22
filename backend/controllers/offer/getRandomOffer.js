'use strict';

const { getConnection } = require('../../dbsql');

const { generateError } = require('../../util/helpers');

// Obtenemos las n ofertas aleatorias que le especifiquemos
// Ruta /offer/random/:limit
async function getRandomOffer(req, res, next) {
  let connection;

  try {
    const { limit } = req.params;
    console.log(limit);
    connection = await getConnection();

    // TODO Ver necesidades de más campos en esta consulta
    const sqlQuery = `SELECT DISTINCT o.*, p.*, u.*, c.city_name FROM offer o
          JOIN provider p ON o.provider_id = p.user_id
          JOIN user u ON u.user_id = p.user_id
          JOIN city c ON c.city_id = o.city_id
          WHERE o.statusx = 1  
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
      payload: result
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getRandomOffer;
