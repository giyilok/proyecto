'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Obtiene los horarios de la oferta con el id especificado
// Ruta /availability/:id Método GET
async function getAvailabilitiesByOfferId(req, res, next) {
  let connection;

  try {
    const offerId = req.params.offerId;

    connection = await getConnection();

    const sqlQuery = `SELECT * FROM offer_availability o
                      JOIN  availability a ON o.availability_id = a.availability_id 
                      WHERE offer_id = ?`;

    const [result] = await connection.query(sqlQuery, [offerId]);

    if (!result.length) {
      throw generateError(
        'No se ha encontrado ninguna disponibilidad horaria para esta oferta',
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

module.exports = getAvailabilitiesByOfferId;
