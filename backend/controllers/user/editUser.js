'use stric';

const { editUserSchema } = require('../../util/validations');

const UserModel = require('../../models/UserModel');

const {
  processAndSavePhoto,
  generateError,
  deletePhoto
} = require('../../util/helpers');

// TODO Revisar y mejorar el Joi
// Ruta para actualizar los datos del usuario
async function editUser(req, res, next) {
  try {
    await editUserSchema.validateAsync(req.body);

    const { id } = req.params;
    const {
      user_name,
      last_name,
      birth_date,
      gender,
      city_id,
      email,
      phone
    } = req.body;

    // Comprobamos que exista el usuario
    /* const sqlQuery = 'SELECT * FROM user WHERE user_id = ?';
    const [result] = await connection.query(sqlQuery, [id]); */
    const user = await UserModel.getUserById(id);
    console.log(user);

    if (!user) {
      throw generateError(`No existe el usuario con el id ${id}`, 404);
    }

    //const [user] = existingUser;

    // Compobamos si el usuario de req.auth es el mismo que el solicitado o es el administrador
    if (user.user_id !== req.auth.id && req.auth.role !== 3) {
      throw generateError('No tienes permisos para editar el usuario', 401);
    }

    // Comprobamos si existe una imagen para subir y lo procesamos
    let savedFileName;

    if (req.files && req.files.photo) {
      try {
        savedFileName = await processAndSavePhoto(req.files.photo);

        if (user && user.photo) {
          await deletePhoto(user.photo);
        }
      } catch (error) {
        throw generateError(
          'No se ha podido procesar la imágen. Inténtelo de nuevo',
          400
        );
      }
    } else {
      savedFileName = user.photo;
    }

    // Actualizamos los datos del usuario
    /* const sqlQueryUpdate =
      'UPDATE user SET user_name = ?, last_name = ?, birth_date = ?, gender = ?, city_id = ?, email = ?, image = ?, phone = ? WHERE user_id = ?';

    await connection.query(sqlQueryUpdate, [
      user_name,
      last_name,
      birth_date,
      gender,
      city_id,
      email,
      savedFileName,
      phone,
      id
    ]); */
    await UserModel.editUser(
      user_name,
      last_name,
      birth_date,
      gender,
      city_id,
      email,
      savedFileName,
      phone,
      id
    );

    res.send({ status: 'ok', message: 'Usuario actualizado' });
  } catch (error) {
    next(error);
  }
}

module.exports = editUser;
