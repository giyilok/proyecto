'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

async function activateUser(req, res, next) {
  let connection;

  try {
    const { code } = req.query;

    connection = await getConnection();

    //Actualizamos el usuario poniendo statusx = 1
    const sqlQuery =
      'UPDATE user SET statusx = 1, registration_code = NULL WHERE registration_code = ?';

    const [result] = await connection.query(sqlQuery, [code]);
    console.log(result);

    // Comprobamos si se produjo la actualización
    if (result.affectedRows === 0) {
      throw generateError('Validación incorrecta', 400);
    }

    // // Si queremos dar el token descomentar las siguientes líneas
    // const [user] = await connection.query('SELECT role from users where id=?', [
    //   id
    // ]);

    // // Build jsonwebtoken
    // const tokenPayload = { id: id, role: user[0].role };
    // const token = jwt.sign(tokenPayload, process.env.SECRET, {
    //   expiresIn: '30d'
    // });

    res.send({
      status: 'ok',
      message: 'Usuario validado. Ya se puede hacer login'
      //data: { token }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = activateUser;
