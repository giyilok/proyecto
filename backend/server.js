'use strict';

require('dotenv').config();

// Importamos los módulos necesarios
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Importamos los enrutadores
const userRoutes = require('./routes/userRoutes');
const providerRoutes = require('./routes/providerRoutes');
const offerRoutes = require('./routes/offerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const cityRoutes = require('./routes/cityRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const featureRoutes = require('./routes/featureRoutes');

//Configuraciones
const port = process.env.PORT;

// Arrancamos la aplicación
const app = express();

// Middlewarews de inicio
app.use(morgan('dev'));
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Importamos las rutas
app.use('/user', userRoutes);
app.use('/provider', providerRoutes);
app.use('/offer', offerRoutes);
app.use('/booking', bookingRoutes);
app.use('/city', cityRoutes);
app.use('/rating', ratingRoutes);
app.use('/category', categoryRoutes);
app.use('/availability', availabilityRoutes);
app.use('/feature', featureRoutes);

// Middleware de error
app.use((error, req, res, next) => {
  res.status(error.httpCode || 500).send({
    status: 'error',
    message: error.message
  });
});

// Levantamos el servidor
app.listen(port, () =>
  console.log(`Servidor on fire en http://localhost:${port}`)
);
