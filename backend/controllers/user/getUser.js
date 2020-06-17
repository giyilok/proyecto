'use strict';

/* const { getConnection } = require('../../dbsql');

const { generateError } = require('../../util/helpers'); */

const UserModel = require('../../models/UserModel');

// Devuelve los datos de un usuario por id
// Ruta /user/:id  Method:GET
async function getUser(req, res, next) {
  try {
    const { id } = req.params;

    /* // connection = await getConnection();

    const [
      result
    ] = await connection.query(`select * from user where user_id = ?`, [id]);

    // Comprobamos si existe el usuario en la db
    if (!result.length) {
      throw generateError(`No existe el usuario con id ${id}`, 404);
    }

    // Poner aquí los campos que se quieran devolver en el payload
    const [payload] = result; */

    // Pedimos los datos del usuario al modelo
    // Aquí podríamos decidir lo que queremos cargar en el payload
    const payload = await UserModel.getUserById(id);

    // Si todo fue bien, enviamos la respuesta con los datos
    res.send({
      status: 'ok',
      data: payload,
      message: 'Datos del usuario obtenidos con éxito'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getUser;
