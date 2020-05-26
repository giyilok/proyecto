'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');
const { offerSchema } = require('../../util/validations');

// TODO  Hay que desabilitar el id, que es el provider_id, pues ya viene en la req.aut
// después de haberse autentificado con usuario y proveedor previamente
// Edita una oferta según su estado actual
// Ruta /offer/edit/:offerId Método PUT
async function editOffer(req, res, next) {
  let connection;

  try {
    // Validamos los datos de entrada
    const {
      city_id,
      title,
      description,
      customer_min,
      price,
      price_type,
      ...categories
    } = req.body;

    //const { id } = req.auth;

    await offerSchema.validateAsync({
      city_id,
      title,
      description,
      customer_min,
      price,
      price_type,
      categories
    });

    // Insertamos en la offer los datos validados
    const { offerId } = req.params;
    connection = await getConnection();

    // Dependiendo del estado de la oferta se podrá actualizar:
    // Borrador (0) - Se actualizan todos los datos
    // Publicada (1) - Se puede actualizar solo si no tiene ninguna reserva
    // Activada (2) o archivada (3) No se puede pueden modificar
    const { statusx, offersCount } = req.claims;

    if (statusx === 0) {
      const sqlQuery = 'UPDATE offer SET ? WHERE offer_id = ?';
      await connection.query(sqlQuery, [
        {
          city_id,
          title,
          description,
          customer_min,
          price,
          price_type
        },
        offerId
      ]);
    } else if (statusx === 1 && offersCount === 0) {
      const sqlQuery = 'UPDATE offer SET ? WHERE offer_id = ?';
      await connection.query(sqlQuery, [
        {
          title,
          description,
          customer_min,
          price,
          price_type
        },
        offerId
      ]);
    } else {
      throw generateError(
        'No se puede editar una oferta archivada o con reservas',
        403
      );
    }

    // Borramos las categorias antiguas y grabamos las actualizadas
    await connection.query('DELETE FROM offer_category WHERE offer_id = ?', [
      offerId
    ]);

    for (const category of categories.category) {
      connection.query(
        'INSERT INTO offer_category (offer_id, category_id) VAlUES (?, ?)',
        [offerId, category]
      );
    }

    // Si todo fue bien devolvemos el resultado
    res.status(201).send({
      status: 'ok',
      message: 'Oferta actualizada'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editOffer;
