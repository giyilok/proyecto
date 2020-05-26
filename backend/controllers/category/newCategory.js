'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Añade una nueva categoría a la base de datos
// Ruta /category Método POST
async function newCategory(req, res, next) {
  let connection;

  try {
    const { categoryName, description } = req.body;

    connection = await getConnection();

    // Comprobar que no existe la categoría
    const sqlQuery = `SELECT category_id FROM category WHERE category_name = ?`;
    const [categories] = await connection.query(sqlQuery, [categoryName]);

    console.log(categories);
    if (categories.length) {
      throw generateError('Error. Ya existe la categoría', 500);
    }

    // Añadir la categoría
    const sqlQueryNew =
      'INSERT INTO category(category_name, category_description) VALUES(?,?)';
    await connection.query(sqlQueryNew, [categoryName, description]);

    res.status(200).json({
      status: 'ok',
      message: 'Categoría añadida'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newCategory;
