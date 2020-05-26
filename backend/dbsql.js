//Configuramos el pool de conexiones a la mysql db
require('dotenv').config();

const mysql = require('mysql2/promise');

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

let pool;

// TODO Comprobar error en la creación de las conexiones(err.stack)
// Get connection from pool
async function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      connectionLimit: 10,
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE
    });
  }

  return await pool.getConnection();
}

module.exports = {
  getConnection
};
