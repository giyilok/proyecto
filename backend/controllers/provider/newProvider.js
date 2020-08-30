'use strict';

const bcrypt = require('bcrypt');
const getYear = require('date-fns/getYear');
const { getConnection } = require('../../dbsql');

const {
  processAndSavePhoto,
  generateError,
  randomString,
  sendEmail
} = require('../../util/helpers');

const { userSchema } = require('../../util/validations');
//const { providerSchema } = require('../../util/providerValidations');

// TODO Actualizar los Joi de la parte de proveedor y resto de user. Colocar bien los try catch
//Registro de usuario o proveedor. Subir una imagen.
async function newUser(req, res, next) {
  let connection;

  try {
    // Validamos los datos enviados en la request
    const {
      email,
      password,
      user_name,
      last_name,
      birth_date,
      gender,
      city_name,
      phone,
      ...data
    } = req.body;

    await userSchema.validateAsync({ email, password });
    //await providerSchema.validateAsync(data);

    connection = await getConnection();

    //Comprobar si el usuario ya existe
    const [
      existingUser
    ] = await connection.query('select user_id from user where email = ?', [
      email
    ]);

    if (existingUser.length) {
      throw generateError('Ya existe un usuario con el mismo email', 409);
    }

    // Encriptamos la password
    const dbPassword = await bcrypt.hash(password, 10);

    // Creamos una cadena aleatoria como para el enlace de validación
    const registrationCode = randomString(40);

    const validationURL = `http://${process.env.PUBLIC_HOST}/user/activate?code=${registrationCode}`;

    //Si se sube una imagen, la procesamos y generamos el nombre para insertar en la bd
    // TODO Generar una imagen pequeña para los avatares
    let savedFileName;
    if (req.files && req.files.photo) {
      console.log('Existe el fichero');
      try {
        savedFileName = await processAndSavePhoto(req.files.photo);
      } catch (error) {
        throw generateError(
          'No se ha podido procesar la imágen. Inténtelo de nuevo',
          400
        );
      }
    } else {
      // Si no se sube ninguna imagen, ponemos una por defecto
      savedFileName = 'defaultAvatar.png';
    }

    // Grabamos el usuario en la db
    const [
      resultId
    ] = await connection.query(
      `insert into user (email, pass, registration_code, role, image, user_name, last_name, birth_date, gender, city_name, phone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email,
        dbPassword,
        registrationCode,
        2,
        savedFileName,
        user_name,
        last_name,
        birth_date,
        gender,
        city_name,
        phone
      ]
    );

    //Obtenemos el id del usuario registrado
    const lastIdInsert = resultId.insertId;

    const { initWork, biography, speciality } = data;

    const xp_years = getYear(new Date()) - initWork;

    console.log('Hasta aquí todo ok', initWork, biography, speciality);

    const sqlQueryProvider =
      'INSERT INTO provider(user_id, xp_years, init_work_at, biography, speciality) values(?, ?, ?, ?, ?)';
    await connection.query(sqlQueryProvider, [
      lastIdInsert,
      xp_years,
      initWork,
      biography,
      speciality
    ]);

    try {
      await sendEmail({
        email: email,
        title: `Valida tu cuenta de proveedor para MeuCare`,
        content: `Para validar tu cuenta de proveedor pega esta url en tu navegador: ${validationURL}`
      });
    } catch (error) {
      throw generateError(
        'Error en el envío del mail. Inténtelo de nuevo más tarde',
        500
      );
    }

    //Enviamos la respuesta
    res.status(200).send({
      status: 'ok',
      message: `Proveedor registrado. Mira tu email para activarlo`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newUser;

/* async function newUser(req, res, next) {
  let connection;

  try {
    // Validamos los datos enviados en la request
    const {
      email,
      password,
      user_name,
      last_name,
      birth_date,
      gender,
      city_name,
      phone,
      ...data
    } = req.body;

    await userSchema.validateAsync({ email, password });
    //await providerSchema.validateAsync(data);

    connection = await getConnection();

    //Comprobar si el usuario ya existe
    const [
      existingUser
    ] = await connection.query('select user_id from user where email = ?', [
      email
    ]);

    if (existingUser.length) {
      throw generateError('Ya existe un usuario con el mismo email', 409);
    }

    // Encriptamos la password
    const dbPassword = await bcrypt.hash(password, 10);

    // Creamos una cadena aleatoria como para el enlace de validación
    const registrationCode = randomString(40);

    const validationURL = `http://${process.env.PUBLIC_HOST}/user/activate?code=${registrationCode}`;

    // Grabamos el usuario en la db
    const [
      resultId
    ] = await connection.query(
      `insert into user (email, pass, registration_code,  role, user_name, last_name, birth_date, gender, city_name, phone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email,
        dbPassword,
        registrationCode,
        2,
        user_name,
        last_name,
        birth_date,
        gender,
        city_name,
        phone
      ]
    );

    //Obtenemos el id del usuario registrado
    const lastIdInsert = resultId.insertId;

    let rol = 'usuario';

    if (Number(role) === 2) {
      const {
        user_name,
        last_name,
        birth_date,
        gender,
        city_name,
        phone,
        ...dataProvider
      } = data;

      const sqlQuery =
        'UPDATE user SET user_name = ?, last_name = ?, birth_date = ?, gender = ?, city_name = ?, phone = ? WHERE user_id = ?';

      await connection.query(sqlQuery, [
        user_name,
        last_name,
        birth_date,
        gender,
        city_name,
        phone,
        lastIdInsert
      ]);

      const { init_work_at, biography, speciality } = dataProvider;

      const xp_years = getYear(new Date()) - init_work_at;

      const sqlQueryProvider =
        'INSERT INTO provider(user_id, xp_years, init_work_at, biography, speciality) values(?, ?, ?, ?, ?)';
      await connection.query(sqlQueryProvider, [
        lastIdInsert,
        xp_years,
        init_work_at,
        biography,
        speciality
      ]);

      rol = 'Proveedor';
    }

    try {
      await sendEmail({
        email: email,
        title: `Valida tu cuenta de ${rol} para MeuCare`,
        content: `Para validar tu cuenta de ${rol} pega esta url en tu navegador: ${validationURL}`
      });
    } catch (error) {
      throw generateError(
        'Error en el envío del mail. Inténtelo de nuevo más tarde',
        500
      );
    }

    //Enviamos la respuesta
    res.send({
      status: 'ok',
      message: `${rol} registrado. Mira tu email para activarlo`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}
 */
