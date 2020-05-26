'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Borra la valoración y comentario (opcional) del usuario y proveedor
// especificados. Solo el administrador puede borrar usuarios.
// Ruta /rating/user/:user/provider/:providerId  Método DELETE
async function deleteRating(req, res, next) {
  let connection;

  try {
    const { user_id, provider_id } = req.params;
    connection = await getConnection();

    // Comprobar que existe la valoración especificada
    const sqlQueryOldRating =
      'SELECT score FROM rating WHERE (user_id = ?) AND (provider_id = ?)';
    const [ratingMatch] = await connection.query(sqlQueryOldRating, [
      user_id,
      provider_id
    ]);

    if (!ratingMatch.length) {
      throw generateError('No existe la valoración solicitada.', 404);
    }

    const score = ratingMatch[0].score;

    // Actualizar la valoración, y el comentario, si corresponde
    try {
      await connection.query('START TRANSACTION');

      await connection.query(
        'DELETE FROM rating WHERE user_id = ? AND provider_id = ?',
        [user_id, provider_id]
      );

      // Actualizar los datos de rating del proveedor en la db
      const [
        data
      ] = await connection.query(
        'UPDATE provider SET rating_count = rating_count - 1, score_total = score_total - ?, score_avg = score_total / rating_count WHERE user_id = ?',
        [score, provider_id]
      );

      if (!data.affectedRows) {
        throw generateError(
          'ERROR. No se ha podido borrar la valoración.',
          400
        );
      }

      await connection.query('COMMIT');
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    }

    res.status(200).json({
      status: 'ok',
      message: 'Valoración eliminada'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteRating;

// TODO Arreglar el bug de la división
