'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

async function getAvailabilities(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const sqlQuery = 'SELECT * FROM availability';

    const [result] = await connection.query(sqlQuery);

    if (!result.length) {
      throw generateError(
        'No se ha encontrado ninguna disponibilidad horaria',
        400
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

module.exports = getAvailabilities;
