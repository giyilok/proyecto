'use strict';

const { getConnection } = require('../../dbsql');

const { generateError } = require('../../util/helpers');

// Actualiza el estado de la oferta: de borrado a publicada a archivada
// Ruta /set/:statusx/offer/:offerId
async function setOfferStatus(req, res, next) {
  let connection;

  try {
    const { statusx, offerId } = req.params;

    const { setSchema } = require('../../util/validations');

    // Comprobamos que el statusx sea válido
    await setSchema.validateAsync(statusx);

    connection = await getConnection();

    const sqlQuery = 'UPDATE offer SET statusx = ? WHERE offer_id = ?';
    const [result] = await connection.query(sqlQuery, [statusx, offerId]);

    if (!result.affectedRows) {
      throw generateError('La oferta no existe', 404);
    }

    console.log('STOP', result.affectedRows);
    res.status(200).send({
      status: 'ok',
      message: `Actualizado con éxito el estado de la oferta a ${statusx}`,
      data: result.affectedRows
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = setOfferStatus;
