'use strict';

const { getConnection } = require('../../dbsql');

const { generateError, sendEmail } = require('../../util/helpers');

// TODO Mejorar las consultas de los datos de usuario y proveedor.
// Implementar función para el envío de los emails
// Registra una nueva reserva de la oferta especificada
// Ruta /booking/:offerId Método POST
async function newBooking(req, res, next) {
  let connection;

  try {
    const { id: userId } = req.auth;
    const { offerId } = req.params;
    let { statusx } = req.claims;
    const { customer_min } = req.claims;
    let bookingId;

    connection = await getConnection();

    // Comprobar si el usario existe (hecho con el middleware checkUser)
    // Comprobar que la oferta existe (hecho con el middleware checkOffer)
    // Comprobar que no exista ninguna reserva previa de este usuario
    const sqlQuery = `SELECT booking_id FROM booking
                        WHERE offer_id = ? AND user_id = ?`;

    const [results] = await connection.query(sqlQuery, [offerId, userId]);

    if (results.length) {
      throw generateError(
        'Ya existe una reserva de esta oferta para este usuario',
        400
      );
    }

    // Si el estado de la reserva es "publicada" (statusx = 1)
    // iniciamos la transacción de reserva
    if (Number(statusx) === 1) {
      try {
        await connection.query('START TRANSACTION');

        // Insertamos la reserva
        const [
          resultId
        ] = await connection.query(
          'INSERT INTO booking (offer_id, user_id) VALUES (?, ?)',
          [offerId, userId]
        );

        bookingId = resultId.insertId;

        console.log('Insertamos reserva');

        // Comparamos el número de reservas después de la inserción
        const [
          offersNumber
        ] = await connection.query(
          'SELECT COUNT(booking_id) AS offersCount FROM booking WHERE offer_id = ?',
          [offerId]
        );
        const { offersCount } = offersNumber[0];
        console.log(
          `Consulta realizada, la oferta tiene ${offersCount} reservas`
        );

        // Si el número de reservas es mayor del número de activación deshacemos
        // todo lo anterior y lanzamos un error. Si el número de reservas es igual
        // al número de activación ponemos la reserva en estado activada (2).
        if (offersCount > customer_min) {
          console.log('Hasta aquí llego');

          throw generateError(
            'Error no se ha podido realizar la reserva. No quedan plazas',
            400
          );
        }

        if (offersCount == customer_min) {
          await connection.query(
            'UPDATE offer SET statusx = 2 WHERE offer_id = ?',
            [offerId]
          );

          statusx = 2;
        }

        // Finalizamos la transacción realizando un commit
        await connection.query('COMMIT');

        console.log('Transacción realizada  ', statusx);
      } catch (error) {
        await connection.query('ROLLBACK');
        console.log('Error hacemos rollback');
        //throw generateError('Error. No se ha podido realizar la reserva', 500);
        throw error;
      }
    } else {
      throw generateError(
        'No se puede reservar una oferta que esté ya activada o que no esté publicada',
        403
      );
    }

    /* Enviamos las notificaciones a quien corresponda según el estado de la oferta */

    // Obtenemos los datos del proveedor de la oferta
    const sqlProvider = `SELECT u.user_name, u.last_name, u.email FROM user u
                              JOIN offer o ON o.provider_id = u.user_id
                              WHERE o.offer_id = ?`;
    const [resultProvider] = await connection.query(sqlProvider, [offerId]);

    // Datos del proveedor
    const [providerData] = resultProvider;

    // Obtemos los datos del cliente que realiza la reserva
    const sqlUser = `SELECT user_name, last_name, email FROM user 
                              WHERE user_id = ?`;
    const [resultUser] = await connection.query(sqlUser, [userId]);

    // Datos del usuario
    const [userData] = resultUser;
    const resultData = [userData, providerData];

    // Enviamos correo de confirmación de reserva al usuario con copia al proveedor
    try {
      for (const data of resultData) {
        await sendEmail({
          email: data.email,
          title: 'Confirmación de reserva en MeuCare',
          content: `Estimado ${data.user_name} ${data.last_name}:
          
                    Confirmamos su reserva nº ${bookingId} de la oferta`
        });
      }
    } catch (error) {
      throw new Error(
        'Error en el envío del mail. Inténtelo de nuevo más tarde'
      );
    }

    // Si la oferta se activó se envía correo de aviso a todos los usuarios y al proveedor
    // Obtenemos el listado de los usuarios con reserva
    const sqlQueryUsers = `SELECT u.user_name, u.last_name, u.email FROM user u
                          LEFT JOIN booking b ON b.user_id = u.user_id
                          LEFT JOIN offer o ON o.offer_id = b.offer_id
                          WHERE o.offer_id = ?`;
    let [resultUsers] = await connection.query(sqlQueryUsers, [offerId]);
    resultUsers = [...resultUsers, providerData];
    console.log(resultUsers);

    try {
      for (const data of resultData) {
        await sendEmail({
          email: data.email,
          title: 'Activación de servicio en MeuCare',
          content: `Estimado ${data.user_name} ${data.last_name}:

                    ¡Se ha activado su servicio con referencia nº ${offerId}
                    En breve su proveedor se pondrá en contacto con usted`
        });
      }
    } catch (error) {
      throw new Error(
        'Error en el envío del mail. Inténtelo de nuevo más tarde'
      );
    }

    // Si todo fue bien devolvemos el resultado
    res.send({
      status: 'ok',
      message: 'Reserva creada. Te hemos enviado un correo de confirmación'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newBooking;
