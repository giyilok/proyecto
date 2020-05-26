'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Obtenemos la lista de categorías de la base de datos
// Ruta /category Método GET
async function getCategories(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const sqlQuery = 'SELECT * FROM category';

    const [result] = await connection.query(sqlQuery);

    if (!result.length) {
      throw generateError('No se ha encontrado ninguna categoría', 400);
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

module.exports = getCategories;
