'use strict';

const { getConnection } = require('../../dbsql');

const { generateError } = require('../../util/helpers');

// Devuelve todos los proveedores que tengan por lo menos una oferta activa en este momento
// Ruta /provider/active Método GET
async function offerActiveProvider(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    // TODO Aquí devuelve un array de objetos conteniendo todos los datos de: user,
    // provider y offer. Seleccionar para el front solo los datos que interesen
    const sqlQuery =
      'SELECT DISTINCT * from user JOIN provider ON user.user_id = provider.user_id JOIN offer ON provider.user_id = offer.provider_id WHERE offer.statusx = 1';
    const [result] = await connection.query(sqlQuery, []);
    console.log(result);

    if (!result.lengt) {
      throw generateError(
        'En estos momentos no existe ninguna oferta activa',
        400
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

module.exports = offerActiveProvider;
