'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Búsqueda general por keyword en una sola caja de búsqueda en la landing
// para buscar por: ciudad, categoría, disponibilidad, título y
// nombre y apellido del proveedor
// Ruta /offer/search/land Método GET
async function searchOffer(req, res, next) {
  let connection;

  try {
    const { keyword } = req.query;

    connection = await getConnection();

    // Query base
    let sqlQuery = `SELECT DISTINCT o.offer_id, o.title, o.description, u.user_name,  
    u.last_name, p.speciality, p.score_avg, p.xp_years, c.city_name FROM offer o
    JOIN provider p ON p.user_id = o.provider_id
    JOIN user u ON u.user_id = p.user_id
    JOIN city c ON c.city_id = o.city_id
    LEFT JOIN offer_availability oa ON oa.offer_id = o.offer_id 
    LEFT JOIN availability av ON av.availability_id = oa.availability_id
    LEFT JOIN offer_category oc ON oc.offer_id = o.offer_id 
    LEFT JOIN category cat ON cat.category_id = oc.category_id
    WHERE o.statusx = 1 AND c.city_name LIKE ? OR u.user_name LIKE ? OR u.last_name LIKE ?
    OR o.title LIKE ? OR cat.category_name LIKE ? OR av.av_name LIKE ? ORDER BY RAND()`;

    const [results] = await connection.query(sqlQuery, [
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`
    ]);

    // Si no existe resultado
    if (!results.length) {
      throw generateError(
        'No exiten resultados con esos parámetros de búsqueda',
        404
      );
    }
    res.status(200).json({
      status: 'ok',
      message: 'Resultados de la búsqueda',
      data: results
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = searchOffer;
