'use strict';

const { getConnection } = require('../../dbsql');

const { generateError } = require('../../util/helpers');

// Obtenemos la lista de ciudades
// Ruta /city Método GET
async function getCities(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const sqlQuery = 'SELECT * FROM city';

    const [result] = await connection.query(sqlQuery);

    if (!result.length) {
      throw generateError('No se ha encontrado ninguna ciudad', 400);
    }

    res.status(200).send({
      status: 'ok',
      cities: result
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getCities;
