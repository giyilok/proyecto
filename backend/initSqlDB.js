require('dotenv').config();
const bcrypt = require('bcrypt');
const faker = require('faker/locale/es');
//const { random } = require('lodash');
const fs = require('fs').promises;

const { getConnection } = require('./dbsql');
const { formatDateToDB } = require('./util/helpers');

// const args = process.argv;
// const addData = args[2] === '--data';

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
    const birthDate = formatDateToDB(new Date(1976, 5, 29));

    await connection.query('INSERT INTO user SET ?', {
      user_name: 'Giyi',
      last_name: 'Lok',
      birth_date: birthDate,
      gender: 'Male',
      email: 'giyilok@gmail.com',
      pass: password,
      statusx: 1,
      city_name: 'Ferrol',
      role: 3,
      image: 'avatar.jpg'
    });
    console.log('Insertado el administrador');

    // Insertar los datos de los usuarios predefinidos
    const users = 6;

    for (let index = 0; index < users; index++) {
      const name = faker.name.firstName();
      const lastName = faker.name.lastName();
      const birthDate = faker.date.past();
      const gender = faker.random.arrayElement(['Female', 'Male']);
      const city = faker.random.arrayElement([
        'Ferrol',
        'Coruña',
        'Ares',
        'Cambre'
      ]);
      const email = faker.internet.email();
      const password = await bcrypt.hash(faker.internet.password(), 10);
      const image = faker.image.avatar();
      const phone = faker.phone.phoneNumber();

      await connection.query('INSERT INTO user SET ?', {
        user_name: name,
        last_name: lastName,
        birth_date: birthDate,
        gender: gender,
        city_name: city,
        email: email,
        pass: password,
        statusx: 1,
        role: 1,
        image: image,
        phone: phone
      });
    }

    console.log('Insertados los datos de los usuarios faker');

    // Cargar los datos de los usuarios clientes de prueba
    // Usuario 1
    await connection.query('INSERT INTO user SET ?', {
      user_name: 'Guillermo',
      last_name: 'Taboada Sánchez',
      birth_date: formatDateToDB(new Date(2007, 4, 1)),
      gender: 'Male',
      city_name: 'A Coruña',
      email: 'giyilok+1@gmail.com',
      pass: await bcrypt.hash('dander', 10),
      statusx: 1,
      role: 1,
      image: 'avatar.jpg',
      phone: '638384336'
    });

    // Usuario 2
    await connection.query('INSERT INTO user SET ?', {
      user_name: 'Nuria',
      last_name: 'Taboada Sánchez',
      birth_date: formatDateToDB(new Date(1985, 4, 1)),
      gender: 'Female',
      city_name: 'A Coruña',
      email: 'giyilok+2@gmail.com',
      pass: await bcrypt.hash('dander', 10),
      statusx: 1,
      role: 1,
      image: 'avatar.jpg',
      phone: '638384336'
    });
    // Usuario 3
    await connection.query('INSERT INTO user SET ?', {
      user_name: 'Laura',
      last_name: 'Taboada Sánchez',
      birth_date: formatDateToDB(new Date(1979, 4, 1)),
      gender: 'Female',
      city_name: 'A Coruña',
      email: 'giyilok+3@gmail.com',
      pass: await bcrypt.hash('dander', 10),
      statusx: 1,
      role: 1,
      image: 'avatar.jpg',
      phone: '638384336'
    });

    // Proveedor 1
    const [resultId] = await connection.query('INSERT INTO user SET ?', {
      user_name: 'Paula',
      last_name: 'Ortega',
      birth_date: formatDateToDB(new Date(2007, 4, 1)),
      gender: 'Female',
      city_name: 'Ares',
      email: 'gtaboada@mac.com',
      pass: await bcrypt.hash('dander', 10),
      statusx: 1,
      role: 2,
      image: 'avatar.jpg',
      phone: '615526559'
    });

    // Conseguimos el user_id del proveedor
    const providerId = resultId.insertId;

    await connection.query('INSERT INTO provider SET ?', {
      user_id: providerId,
      xp_years: 7,
      init_work_at: 2013,
      rating_count: 2,
      score_total: 8,
      score_avg: 4,
      biography:
        'Estudié hostelería en el IES Fragas do Eume. Después estuve trabajando como asesor en tareas de limpieza',
      speciality: 'Cocina'
    });
    await connection.query;

    console.log('Insertados los datos de los usuarios y proveedores de prueba');
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
  process.exit();
})();
