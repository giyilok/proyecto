'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Búsqueda avanzada para varias cajas de búsqueda y/o selectores
// utilizando los criterios de nombre proveedor, apellido proveedor
// ciudad, categoría, disponibilidad horaria
// y valoración del proveedor, con selector de ordenación
// Ruta /offer/search Método GET
async function avancedSearchOffer(req, res, next) {
  let connection;

  try {
    const {
      userName,
      lastName,
      city,
      category,
      availability,
      filter,
      sort
    } = req.query;

    console.log(req.query);
    console.log(userName);

    let sqlQuery = `SELECT DISTINCT o.offer_id, o.title, o.description, o.price, o.price_type, o.provider_id, o.create_at, u.user_name,  
    u.last_name, u.image, p.speciality, p.score_avg, p.xp_years, o.city_name FROM offer o
    JOIN provider p ON p.user_id = o.provider_id
    JOIN user u ON u.user_id = p.user_id
    LEFT JOIN offer_availability oa ON oa.offer_id = o.offer_id 
    LEFT JOIN availability av ON av.availability_id = oa.availability_id
    LEFT JOIN offer_category oc ON oc.offer_id = o.offer_id 
    LEFT JOIN category cat ON cat.category_id = oc.category_id`;

    let results = [];
    let conditions = [];
    let params = [];
    let whereOptions = 'WHERE o.statusx = 1 AND';
    let sqlQuerySort = 'ORDER BY RAND()';

    connection = await getConnection();

    // Búsqueda con filtros y criterio de ordenación
    if (filter) {
      if (userName || lastName || city || category || availability) {
        if (userName) {
          conditions.push('u.user_name = ?');
          params = [...params, userName];
        }

        if (lastName) {
          conditions.push('u.last_name = ?');
          params = [...params, lastName];
        }
        console.log(city);
        if (city) {
          conditions.push('o.city_name = ?');
          params = [...params, city];
        }

        if (category) {
          conditions.push('cat.category_name = ?');
          params = [...params, category];
        }

        if (availability) {
          conditions.push('av.av_name = ?');
          params = [...params, availability];
        }
        console.log(params);
      }

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

      sqlQuery = `${sqlQuery} ${whereOptions} ${conditions.join(
        ' AND '
      )} ${sqlQuerySort}`;
    } else {
      // Búsqueda general con ordenación aleatoria
      if (userName || lastName || city || category || availability) {
        if (userName) {
          conditions.push('u.user_name LIKE ?');
          params = [...params, `%${userName}%`];
        }

        if (lastName) {
          conditions.push('u.last_name LIKE ?');
          params = [...params, `%${lastName}%`];
        }

        if (city) {
          conditions.push('o.city_name LIKE ?');
          params = [...params, `%${city}%`];
        }

        if (category) {
          conditions.push('cat.category_name LIKE ?');
          params = [...params, `%${category}%`];
        }

        if (availability) {
          conditions.push('av.av_name LIKE ?');
          params = [...params, `%${availability}%`];
        }
      }

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

      sqlQuery = `${sqlQuery} ${whereOptions} ${conditions.join(
        ' OR '
      )} ${sqlQuerySort}`;
    }
    console.log(sqlQuery, 'Esta es la query');
    [results] = await connection.query(sqlQuery, params);

    if (!results.length) {
      throw generateError(
        'No existen resultados con esos parámetros de búsqueda',
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

module.exports = avancedSearchOffer;
