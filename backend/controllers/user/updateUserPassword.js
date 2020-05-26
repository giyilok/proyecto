'use strict';
const bcrypt = require('bcrypt');
const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');
const { editPasswordUserSchema } = require('../../util/validations');

// Actualización de la contraseña
// Ruta post /users/:id/password
async function updateUserPassword(req, res, next) {
  let connection;

  try {
    const { id } = req.params;

    connection = await getConnection();

    // Validamos los passwords
    await editPasswordUserSchema.validateAsync(req.body);

    const { oldPassword, newPassword } = req.body;

    // Comprobamos si la id de usuario es la misma que viene en la req
    if (Number(id) !== req.auth.id) {
      throw generateError(
        `No tienes permisos para cambiar la password del usuario ${id}`,
        401
      );
    }
    // TODO Eliminar o descomentar esta comprobación
    /* // Comprobamos que la nueva newPassword y repeatNewPasswort son iguales
    if (newPassword !== newPasswordRepeat) {
      throw generateError(
        'La password repetida no coincide con la nueva password',
        400
      );
    } */

    // Comprobamos que la nueva password no sea la misma que la antigua
    if (oldPassword === newPassword) {
      throw generateError(
        'La nueva password no puede ser igual que la actual',
        401
      );
    }

    // Obtenemos la password actual de la base de datos
    const sqlQueryPassword = 'SELECT pass FROM user WHERE user_id = ?';
    const result = await connection.query(sqlQueryPassword, [id]);

    // Comprobamos si ese usuario existe en ese momento en la base de datos
    if (!result.length) {
      throw generateError(
        `El usuario con id ${id} no existe en la base de datos`,
        410
      );
    }

    const [user] = result;
    console.log(user[0].pass);
    // Comprobamos que la password actual enviada sea la correcta
    const passwordMatches = await bcrypt.compare(oldPassword, user[0].pass);

    if (!passwordMatches) {
      throw generateError('La password antigua es incorrecta', 401);
    }

    // Si todo fue bien encriptamos la nueva password y la actualizamos
    // en la tabla de usuarios
    const dbNewPassword = await bcrypt.hash(newPassword, 10);
    console.log(dbNewPassword);
    const sqlQueryNewPassword =
      'UPDATE user SET pass = ?, lastPasswordUpdate = NOW() WHERE user_id = ?';
    await connection.query(sqlQueryNewPassword, [dbNewPassword, id]);

    res.send({
      status: 'ok',
      message: 'Cambio de password realizado con éxito.'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = updateUserPassword;
