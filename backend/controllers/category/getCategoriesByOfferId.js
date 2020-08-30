'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Obtenemos la lista de categorías de la oferta especificada
// Ruta /category/:offerId Método GET
async function getCategoriesByOfferId(req, res, next) {
  let connection;

  try {
    const offerId = req.params.offerId;

    connection = await getConnection();

    const sqlQuery = `SELECT * FROM offer_category
                       JOIN category ON offer_category.category_id = category.category_id 
                       WHERE offer_id = ?`;

    const [result] = await connection.query(sqlQuery, [offerId]);

    if (!result.length) {
      throw generateError(
        `No se ha encontrado ninguna categoría para la oferta ${offerId}`,
        404
      );
    }

    res.status(200).send({
      status: 'ok',
      data: result
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getCategoriesByOfferId;
