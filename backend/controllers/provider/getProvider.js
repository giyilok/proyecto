'use strict';

const { getConnection } = require('../../dbsql');

const { generateError } = require('../../util/helpers');

// Devuelve los datos de un usuario especificado por id
// Ruta /provider/:id  Method:GET
async function getProvider(req, res, next) {
  let connection;

  try {
    const { id } = req.params;

    connection = await getConnection();

    const [
      result
    ] = await connection.query(`select * from provider where user_id = ?`, [
      id
    ]);

    // Comprobamos si existe el usuario en la db
    if (!result.length) {
      throw generateError(`No existe el proveedor con id ${id}`, 404);
    }

    // Poner aquí los campos que se quieran devolver en el payload
    const [payload] = result;

    res.send({
      status: 'ok',
      data: payload
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getProvider;
