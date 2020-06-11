require('dotenv').config();
const bcrypt = require('bcrypt');
const faker = require('faker/locale/es');
const { random } = require('lodash');
const fs = require('fs').promises;

const { getConnection } = require('./dbsql');
const { formatDateToDB } = require('./util/helpers');

const args = process.argv;
const addData = args[2] === '--data';

(async () => {
  const connection = await getConnection();

  // Cargamos el fichero sql para borrar y crear las tablas
  try {
    const queries = await fs.readFile('meucareSql.sql');

    const queriesArr = queries.toString().split(';');
    console.log(queriesArr);

    for (const query of queriesArr) {
      await connection.query(query);
    }

    console.log('Insertados tablas y datos iniciales');

    // Insertar los datos del usuario administrador
    const password = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);
    await connection.query('INSERT INTO user SET ?', {
      user_name: 'Giyi',
      last_name: 'Lok',
      gender: 'Male',
      email: 'giyilok@gmail.com',
      pass: password,
      city_id: 10,
      role: 3
    });
    console.log('Insertado el administrador');

    // Insertar los datos de los usuarios predefinidos
    const users = 6;

    for (let index = 0; index < users; index++) {
      const name = faker.name.firstName();
      const lastName = faker.name.lastName();
      const birthDate = faker.date.past();
      const gender = faker.random.arrayElement(['Female', 'Male']);
      const city = faker.random.number({ min: 1, max: 10 });
      const email = faker.internet.email();
      const password = await bcrypt.hash(faker.internet.password(), 10);
      const image = faker.image.avatar();
      const phone = faker.phone.phoneNumber();

      await connection.query('INSERT INTO user SET ?', {
        user_name: name,
        last_name: lastName,
        birth_date: birthDate,
        gender: gender,
        city_id: city,
        email: email,
        pass: password,
        statusx: 1,
        role: 1,
        image: image,
        phone: phone
      });
    }

    console.log('Insertados los datos de los usuarios faker');
    // Cargar el resto de datos
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
  process.exit();
})();
