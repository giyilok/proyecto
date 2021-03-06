'use strict';
const bcrypt = require('bcrypt');

// const { getConnection } = require('../../dbsql');

const {
  generateError,
  randomString,
  sendEmail
} = require('../../util/helpers');

const { userSchema } = require('../../util/validations');

const UserModel = require('../../models/UserModel');

//Registro de usuario
async function newUser(req, res, next) {
  // let connection;

  try {
    // Validamos los datos enviados en la request
    await userSchema.validateAsync(req.body);

    //connection = await getConnection();
    const { email, password, role } = req.body;
    console.log(email, password, role);

    // Comprobamos si ya existe algún usuario con ese email
    const existingUser = await UserModel.getUserByMail(email);

    //Comprobar si el usuario ya existe
    /* const [
      existingUser
    ] = await connection.query('select user_id from user where email = ?', [
      email
    ]); */

    // Si el usuario ya existe lanza un error
    if (existingUser.length) {
      throw generateError('Ya existe un usuario con el mismo email', 409);
    }
    // Encriptamos la password
    const dbPassword = await bcrypt.hash(password, 10);

    //Creamos una cadena aleatoria como para el enlace de validación
    const registrationCode = randomString(40);

    const validationURL = `http://${process.env.PUBLIC_HOST}/user/activate?code=${registrationCode}`;

    try {
      await sendEmail({
        email: email,
        title: 'Valida tu cuenta de usuario para MeuCare',
        content: `Para validar tu cuenta de usuario pega esta url en tu navegador: ${validationURL}`
      });
    } catch (error) {
      throw new Error(
        'Error en el envío del mail. Inténtelo de nuevo más tarde'
      );
    }

    // Grabamos el usuario en la db
    /* await connection.query(
      `insert into user (email, pass, registration_code) values (?, ?, ?)`,
      [email, dbPassword, registrationCode]
    ); */
    await UserModel.newUser(email, dbPassword, registrationCode, role);
    console.log('Hasta aquí');

    //Enviamos la respuesta
    res.send({
      status: 'ok',
      message: 'Usuario registrado con éxito. Mira tu email para activarlo'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = newUser;
