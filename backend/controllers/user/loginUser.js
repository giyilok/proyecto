'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getConnection } = require('../../dbsql');
const { userSchema } = require('../../util/validations');
const { generateError } = require('../../util/helpers');

async function loginUser(req, res, next) {
  let connection;

  try {
    await userSchema.validateAsync(req.body);

    const { email, password } = req.body;

    const connection = await getConnection();

    // Buscamos en la db el usuario con los datos proporcionados
    const sqlQuery =
      'SELECT user_id, email, pass, role FROM user WHERE email = ? AND statusx = 1';
    const [dbUser] = await connection.query(sqlQuery, [email]);

    if (!dbUser.length) {
      throw generateError(
        'No existe ningún usuario activo con ese email en la base de datos. Si te acabas de registrar comprueba el email de confirmación.',
        404
      );
    }

    // Comprobamos que la contraseña sea la correcta
    const [user] = dbUser;

    const passwordMatches = await bcrypt.compare(password, user.pass);

    if (!passwordMatches) {
      throw generateError('Password incorrecta', 401);
    }

    // Si todo es correcto creamos el token y lo devolvemos
    const tokenPayload = { id: user.user_id, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.SECRET, {
      expiresIn: '15d'
    });

    res
      .status(200)
      .send({ status: 'ok', message: 'Login correcto', data: { token } });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = loginUser;
