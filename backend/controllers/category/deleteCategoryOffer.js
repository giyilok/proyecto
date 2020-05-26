'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Borra una categoría de una oferta
// Ruta /category/:categoryId/offer/:offerId Método DELETE
async function deleteCategoryOffer(req, res, next) {
  let connection;

  try {
    const { offerId, categoryId } = req.params;
    const { id: providerId } = req.auth.id;

    connection = await getConnection();

    // Comprobar que la oferta exista
    const sqlQueryOffer = 'SELECT provider_id FROM offer WHERE offer_id = ?';
    const [resultOffer] = await connection.query(sqlQueryOffer, [offerId]);

    if (!resultOffer.length) {
      throw generateError('No existe ninguna oferta con ese id', 404);
    }

    const { provider_id } = resultOffer[0];

    // Comprobar que la categoría existe
    const sqlQueryCategory = 'SELECT * FROM category WHERE category_id = ?';
    const [resultCategory] = await connection.query(sqlQueryCategory, [
      categoryId
    ]);

    if (!resultCategory.length) {
      throw generateError('No existe ninguna categoría con ese id', 404);
    }

    // Comprobar que la oferta pertenece al proveedor o es el administrador
    if (providerId !== provider_id && req.auth.role !== 3) {
      throw generateError('No tienes permisos para esta acción', 403);
    }

    // Borrar la categoría para esa oferta
    const sqlQueryDelete =
      'DELETE FROM offer_category WHERE offer_id = ? AND category_id = ?';
    const [resultDelete] = await connection.query(sqlQueryDelete, [
      offerId,
      categoryId
    ]);

    if (!resultDelete.affectedRows) {
      throw generateError('Error. La oferta no tiene esta categoría', 500);
    }

    res.status(200).json({
      status: 'ok',
      message: 'Categoría eliminada con éxito'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteCategoryOffer;
