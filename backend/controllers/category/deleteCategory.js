'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Borra la categoría especificada (solo el administrador)
// Ruta /category/categoryId Método DELETE
async function deleteCategory(req, res, next) {
  let connection;

  try {
    const { categoryId } = req.params;
    console.log(categoryId);
    connection = await getConnection();

    // Comprobar que existe la categoría
    const sqlQuery = 'SELECT * FROM category WHERE category_id = ?';
    const [result] = await connection.query(sqlQuery, [categoryId]);

    if (!result.length) {
      throw generateError('No existe ninguna categoría con ese id', 404);
    }

    const sqlQueryDelete = 'DELETE FROM category WHERE category_id = ?';
    const [resultDelete] = await connection.query(sqlQueryDelete, [categoryId]);
    console.log(resultDelete);
    if (!resultDelete.affectedRows) {
      throw generateError('Error no se ha podido borrar la categoría', 500);
    }

    res.status(200).json({
      status: 'ok',
      message: 'Categoría eliminada'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteCategory;
