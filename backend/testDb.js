const { getConnection } = require('./dbsql.js');

async function main() {
  const connection = await getConnection();

  const result = await connection.query(`select * from user`);
  console.log(result[0]);
  process.exit();
}

main();
