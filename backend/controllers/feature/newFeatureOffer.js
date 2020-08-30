'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Asigna una feature a una oferta
// Ruta /feature/:featureId/offer/:offerId Método POST
async function newFeatureOffer(req, res, next) {
  let connection;

  try {
    const { featureId, offerId } = req.params;
    const { providerId } = req.auth.id;

    connection = await getConnection();

    // Comprobar que la oferta exista
    const sqlQueryOffer = 'SELECT provider_id FROM offer WHERE offer_id = ?';
    const [resultOffer] = await connection.query(sqlQueryOffer, [offerId]);

    if (!resultOffer.length) {
      throw generateError('No existe ninguna oferta con ese id', 404);
    }

    const { provider_id } = resultOffer[0];

    // Comprobar que la categoría existe
    const sqlQueryFeature = 'SELECT * FROM feature WHERE feature_id = ?';
    const [resultFeature] = await connection.query(sqlQueryFeature, [
      featureId
    ]);

    if (!resultFeature.length) {
      throw generateError('No existe ninguna feature con ese id', 404);
    }

    // Comprobar que la oferta pertenece al proveedor o es el administrador
    if (providerId !== provider_id && req.auth.role !== 3) {
      throw generateError('No tienes permisos para esta acción, 403');
    }

    // Comprobar que esa oferta no tiene ya esa categoría
    const sqlQuery =
      'SELECT * FROM offer_feature WHERE offer_id = ? AND feature_id = ?';
    const [result] = await connection.query(sqlQuery, [offerId, featureId]);

    if (result.length) {
      throw generateError('Esta oferta ya tiene esta categoría', 500);
    }

    // Grabar la feature para la oferta especificada
    const sqlQueryWrite =
      'INSERT INTO offer_feature(offer_id, feature_id) VALUES(?, ?)';
    await connection.query(sqlQueryWrite, [offerId, featureId]);

    res.status(200).json({
      status: 'ok',
      message: 'Feature asignada con éxito'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newFeatureOffer;
