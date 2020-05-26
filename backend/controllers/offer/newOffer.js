'use strict';

const { getConnection } = require('../../dbsql');

//const { generateError } = require('../../util/helpers');

const { offerSchema } = require('../../util/validations');

// TODO  Hay que desabilitar el id, que es el provider_id, pues ya viene en la req.aut
// después de haberse autentificado con usuario y proveedor previamente
// Crea y registra una nueva oferta
// Ruta /offer/newOffer Método POST
async function newOffer(req, res, next) {
  let connection;

  try {
    // Validamos los datos de entrada
    const {
      id,
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
    // console.log(categories);
    // Insertamos en la offer los datos validados
    connection = await getConnection();
    const sqlQuery =
      'INSERT INTO offer (provider_id, city_id, title, description, customer_min, price, price_type) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [resultId] = await connection.query(sqlQuery, [
      id,
      city_id,
      title,
      description,
      customer_min,
      price,
      price_type
    ]);

    // Conseguir el offer_id de la oferta
    const offerId = resultId.insertId;

    // Insertamos las categorias en la tabla offer_category
    for (const category of categories.category) {
      connection.query(
        'INSERT INTO offer_category (offer_id, category_id) VAlUES (?, ?)',
        [offerId, category]
      );
    }

    // Si todo fue bien devolvemos el resultado
    res.send({
      status: 'ok',
      message: 'Borrador de oferta guardado. Revisar para publicar'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newOffer;
