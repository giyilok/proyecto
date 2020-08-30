'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Asigna una categoría a una oferta
// Ruta /category/:categoryId/offer/:offerId Método POST
async function newCategoryOffer(req, res, next) {
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
      throw generateError('No tienes permisos para esta acción, 403');
    }

    // Comprobar que esa oferta no tiene ya esa categoría
    const sqlQuery =
      'SELECT * FROM offer_category WHERE offer_id = ? AND category_id = ?';
    const [result] = await connection.query(sqlQuery, [offerId, categoryId]);

    if (result.length) {
      throw generateError('Esta oferta ya pertenece a esta categoría', 500);
    }

    // Grabar la categoría para esa oferta
    const sqlQueryWrite =
      'INSERT INTO offer_category(offer_id, category_id) VALUES(?, ?)';
    await connection.query(sqlQueryWrite, [offerId, categoryId]);

    res.status(200).json({
      status: 'ok',
      message: 'Categoría asignada con éxito'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newCategoryOffer;
