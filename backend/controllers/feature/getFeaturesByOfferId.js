'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Obtiene las features de la oferta con el id especificado
// Ruta /feature/:id Método GET
async function getFeaturesByOfferId(req, res, next) {
  let connection;

  try {
    const offerId = req.params.offerId;

    connection = await getConnection();

    const sqlQuery = `SELECT * FROM offer_feature o
                      JOIN  feature f ON o.feature_id = f.feature_id 
                      WHERE offer_id = ?`;

    const [result] = await connection.query(sqlQuery, [offerId]);

    if (!result.length) {
      throw generateError(
        'No se ha encontrado ninguna feature para esta oferta',
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

module.exports = getFeaturesByOfferId;
