'use strict';

const { getConnection } = require('../dbsql');
const { generateError } = require('../util/helpers');

const UserModel = {
  getUserById: async function (id) {
    const connection = await getConnection();

    const sqlQuery = 'SELECT * FROM user WHERE user_id = ?';
    const [result] = await connection.query(sqlQuery, [id]);

    // Si no se obtiene ningún resultado mandamos error 404
    if (!result.length) {
      throw generateError(`No existe el usuario con id ${id}`, 404);
    }

    // Ponemos aquí los campos que se quu¡ieren enviar en el payload
    const [payload] = result;

    // Devolvemos la respuesta
    connection.release();

    console.log(payload);
    return payload;
  },
  // Obtener usuario por mail
  getUserByMail: async function (email) {
    const connection = await getConnection();

    const sqlQuery = 'SELECT * FROM user WHERE email = ?';
    const [existingUser] = await connection.query(sqlQuery, email);

    connection.release();

    return existingUser;
  },
  // Registra un nuevo usuario
  newUser: async function (email, password, registrationCode) {
    const connection = await getConnection();

    // Preparamos la query
    const sqlQuery =
      'INSERT INTO user SET email = ?, pass = ?, registration_Code = ? ';
    // Insertamos los datos
    await connection.query(sqlQuery, [email, password, registrationCode]);

    connection.release();
  },
  // Actualiza los datos de un usuario
  editUser: async function (
    user_name,
    last_name,
    birth_date,
    gender,
    city_id,
    email,
    savedFileName,
    phone,
    id
  ) {
    const connection = await getConnection();

    // Preparamos la query
    const sqlQueryUpdate =
      'UPDATE user SET user_name = ?, last_name = ?, birth_date = ?, gender = ?, city_id = ?, email = ?, image = ?, phone = ? WHERE user_id = ?';

    // Actualizamos los datos
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
    ]);

    connection.release();
  }
};

module.exports = UserModel;
