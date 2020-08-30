'use strict';

const { getConnection } = require('../../dbsql');

//const { generateError } = require('../../util/helpers');

const { offerSchema } = require('../../util/validations');

// TODO  Comprobar que no haya ningún campo vacío antes de
// enviar el formulario
// Crea y registra una nueva oferta
// Ruta /offer/newOffer Método POST
async function newOffer(req, res, next) {
  let connection;
  console.log('Hasta aquí');

  try {
    // Validamos los datos de entrada
    const {
      provider_id,
      city_name,
      title,
      description,
      customer_min,
      customer_max,
      price,
      price_type,
      availability_id,
      categories,
      features
    } = req.body;

    await offerSchema.validateAsync({
      city_name,
      title,
      description,
      customer_min,
      customer_max,
      price,
      price_type
      //categories
    });

    console.log(
      provider_id,
      city_name,
      title,
      description,
      customer_min,
      customer_max,
      price,
      price_type,
      features
    );

    // Insertamos en la offer los datos validados
    connection = await getConnection();

    const sqlQuery =
      'INSERT INTO offer (provider_id, city_name, title, description, customer_min, customer_max, price, price_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [resultId] = await connection.query(sqlQuery, [
      provider_id,
      city_name,
      title,
      description,
      customer_min,
      customer_max,
      price,
      price_type
    ]);

    // Conseguir el offer_id de la oferta
    const offerId = resultId.insertId;
    // Insertamos las categorias en la tabla offer_category
    for (const category of categories) {
      connection.query(
        'INSERT INTO offer_category (offer_id, category_id) VAlUES (?, ?)',
        [offerId, category.category_id]
      );
    }
    // Insertamos las features en la tabla offer_feature
    for (const feature of features) {
      connection.query(
        'INSERT INTO offer_feature (offer_id, feature_id) VAlUES (?, ?)',
        [offerId, feature.feature_id]
      );
    }

    // Insertar las disponibilidades horarias en la
    // en la tabla offer_availability
    connection.query(
      'INSERT INTO offer_availability (offer_id, availability_id) VALUES (?, ?)',
      [offerId, availability_id]
    );

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
