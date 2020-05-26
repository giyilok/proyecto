'use strict';

const { getConnection } = require('../../dbsql');
const { generateError } = require('../../util/helpers');

// Edita una la categoría especificada
// Ruta /category/:categoryId Método PUT
async function editCategory(req, res, next) {
  let connection;

  try {
    const { categoryName, description } = req.body;
    const { categoryId } = req.params;
    console.log(categoryName, description, categoryId);
    connection = await getConnection();

    // Comprobar que no exista otra categoría con los mismos datos que los del update
    const sqlQueryCheck = `SELECT * FROM category WHERE category_name = ?`;
    const [check] = await connection.query(sqlQueryCheck, [categoryName]);

    if (check.length) {
      throw generateError(
        'Error. Ya existe otra categoría con el mismo nombre',
        404
      );
    }

    // Actualizar los datos de la categoría
    const sqlQueryUpdate =
      'UPDATE category SET category_name = ? , category_description = ? WHERE category_id = ?';
    const [result] = await connection.query(sqlQueryUpdate, [
      categoryName,
      description,
      categoryId
    ]);

    if (!result.affectedRows) {
      throw generateError('Error. No existe la categoría especificada');
    }

    res.status(200).json({
      status: 'ok',
      message: 'Categoría actualizada'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editCategory;
