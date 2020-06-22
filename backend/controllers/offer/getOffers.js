'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Obtiene todas las ofertas odenades según el
// valor del selector del criterio de ordenación
// Ruta /offer/getoffers Método GET
async function getOffers(req, res, next) {
  let connection;

  try {
    const { sort } = req.query;

    console.log(req.query);
    // TODO arreglar esta query para obtener el número de reservas por oferta
    let sqlQuery = `SELECT DISTINCT o.offer_id, o.title, o.description, o.price, o.price_type, o.create_at, u.user_name,  
    u.last_name, u.image, p.speciality, p.score_avg, p.xp_years, o.customer_min, c.city_name
    FROM offer o
    JOIN provider p ON p.user_id = o.provider_id
    JOIN user u ON u.user_id = p.user_id
    JOIN city c ON c.city_id = o.city_id
    LEFT JOIN offer_availability oa ON oa.offer_id = o.offer_id 
    LEFT JOIN availability av ON av.availability_id = oa.availability_id
    LEFT JOIN offer_category oc ON oc.offer_id = o.offer_id 
    LEFT JOIN category cat ON cat.category_id = oc.category_id
    `;

    let results = [];
    let whereOptions = 'WHERE o.statusx = 1 ';
    let sqlQuerySort = 'ORDER BY RAND()';

    connection = await getConnection();

    console.log('Antes del switch');
    // Preparamos la query según el criterio de ordenación
    switch (sort) {
      case '1':
        sqlQuerySort = 'ORDER BY o.create_at DESC, u.last_name ASC';
        break;
      case '2':
        sqlQuerySort = 'ORDER BY p.score_avg DESC, u.last_name ASC';
        break;
      case '3':
        sqlQuerySort = 'ORDER BY p.xp_years DESC, u.last_name ASC';
        break;
    }

    sqlQuery = `${sqlQuery} ${whereOptions} ${sqlQuerySort}`;

    [results] = await connection.query(sqlQuery);

    if (!results.length) {
      throw generateError(
        'No existen resultados con esos parámetros de búsqueda',
        404
      );
    }

    console.log('LOS RESULTADOS', results);

    res.status(200).json({
      status: 'ok',
      message: 'Resultados de la búsqueda',
      results: results
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getOffers;
