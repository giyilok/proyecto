'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// TODO Comprobar que se borran las categorías con la nueva restricción
// Borra una oferta según su estado actual
// Ruta /offer/:offerId Método DELETE
async function deleteOffer(req, res, next) {
  let connection;

  try {
    // Insertamos en la offer los datos validados
    const { offerId } = req.params;
    connection = await getConnection();

    // Dependiendo del estado de la oferta se podrá borra o no:
    // Borrador (0) - Se puede borrar
    // Publicada (1) - Se puede borrar solo si no tiene ninguna reserva
    // Activada (2) o archivada (3) No se puede pueden borrar
    const { statusx, offersCount } = req.claims;

    if (statusx === 0 || (statusx === 1 && offersCount === 0)) {
      const sqlQuery = 'DELETE FROM offer WHERE offer_id = ?';
      await connection.query(sqlQuery, [offerId]);
    } else {
      throw generateError(
        'No se puede borrar una oferta archivada o con reservas',
        403
      );
    }

    // Si todo fue bien devolvemos el resultado
    res.status(200).send({
      status: 'ok',
      message: 'Oferta eliminada'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteOffer;
