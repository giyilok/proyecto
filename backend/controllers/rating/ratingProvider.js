'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');
const { voteSchema } = require('../../util/validations');

// Crea una valoración y comentario (opcional) del proveedor especificado
// Ruta /rating/:providerId  Método POST
async function ratingProvider(req, res, next) {
  let connection;

  try {
    const { rating, review } = req.body;
    const user_id = req.auth.id;
    const provider_id = Number(req.params.providerId);

    // Validar la valoración
    await voteSchema.validateAsync(req.body);

    connection = await getConnection();

    // Comprobamos si existe el proveedor
    const sqlQuery = 'SELECT role FROM user WHERE user_id = ? AND statusx = 1';
    const [dbProvider] = await connection.query(sqlQuery, [provider_id]);

    if (!dbProvider.length) {
      throw generateError(
        `No existe ningún provedor activo con el id ${provider_id} en la base de datos`,
        404
      );
    }

    // Comprobar si el usuario ya hizo alguna valoración anterior del proveedor
    const sqlQueryOldRating =
      'SELECT * FROM rating WHERE (user_id = ?) AND (provider_id = ?)';
    const [ratingMatch] = await connection.query(sqlQueryOldRating, [
      user_id,
      provider_id
    ]);

    if (ratingMatch.length) {
      throw generateError(
        'Solo puedes valorar una vez al proveedor. Edita la valoración si quieres cambiarla',
        400
      );
    }

    // Comprobar si existe alguna reserva del usuario de alguna oferta del proveedor
    const sqlQueryBooking =
      'SELECT booking_id FROM booking b JOIN offer o ON b.offer_id = o.offer_id WHERE user_id = ? AND provider_id = ?';
    const [result] = await connection.query(sqlQueryBooking, [
      user_id,
      provider_id
    ]);

    if (!result.length) {
      throw generateError(
        'No puedes valorar un usuario con el que no has trabajado.',
        400
      );
    }
    // Guardar la valoración y el comentario, si corresponde
    try {
      await connection.query('START TRANSACTION');
      console.log('Hasta aquí bien');

      await connection.query(
        'INSERT INTO rating (user_id, provider_id, score, review) VALUES(?, ?, ?, ?)',
        [user_id, provider_id, rating, review]
      );

      // Actualizar los datos de rating del proveedor en la db
      const [
        data
      ] = await connection.query(
        'UPDATE provider SET rating_count = rating_count + 1, score_total = score_total + ?, score_avg = score_total / rating_count WHERE user_id = ?',
        [rating, provider_id]
      );

      if (!data.affectedRows) {
        throw generateError(
          'ERROR. No se ha podido realizar la valoración o el proveedor no existe en la base de datos.'
        );
      }

      await connection.query('COMMIT');
    } catch (error) {
      await connection.query('ROLLBACK');
      next(error);
    }

    res.status(200).json({
      status: 'ok',
      message: 'Valoración creada'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = ratingProvider;
