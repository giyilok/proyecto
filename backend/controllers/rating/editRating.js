'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');
const { voteSchema } = require('../../util/validations');

// Crea una valoración y comentario (opcional) del proveedor especificado
// Ruta /rating/:providerId  Método POST
async function editRating(req, res, next) {
  let connection;

  try {
    const { rating, review } = req.body;
    const user_id = req.auth.id;
    const provider_id = req.params.providerId;

    // Validar la valoración
    await voteSchema.validateAsync(req.body);

    connection = await getConnection();

    // Comprobamos si existe el usuario (ya hecho con checkbox)

    // Comprobamos si existe el proveedor
    const sqlQuery = 'SELECT role FROM user WHERE user_id = ? AND statusx = 1';
    const [dbProvider] = await connection.query(sqlQuery, [provider_id]);

    if (!dbProvider.length) {
      throw generateError(
        `No existe ningún provedor activo con el id ${provider_id} en la base de datos`,
        404
      );
    }

    // Comprobar que existe la valoración a editar
    const sqlQueryOldRating =
      'SELECT score FROM rating WHERE (user_id = ?) AND (provider_id = ?)';
    const [ratingMatch] = await connection.query(sqlQueryOldRating, [
      user_id,
      provider_id
    ]);

    const oldRating = ratingMatch[0].score;
    console.log(oldRating);

    if (!ratingMatch.length) {
      throw generateError(
        'No existe la valoración solicitada o ha sido borrada',
        404
      );
    }

    // Actualizar la valoración, y el comentario, si corresponde
    try {
      await connection.query('START TRANSACTION');

      await connection.query(
        'UPDATE rating SET score = ?, review = ? WHERE user_id = ? AND provider_id = ?',
        [rating, review, user_id, provider_id]
      );

      const ratingSum = rating - oldRating;
      console.log('Hasta aquí bien', ratingSum);
      // Actualizar los datos de rating del proveedor en la db
      const [
        data
      ] = await connection.query(
        'UPDATE provider SET score_total = score_total + ?, score_avg = score_total / rating_count WHERE user_id = ?',
        [rating - oldRating, provider_id]
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
      message: 'Valoración actualizada'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editRating;
