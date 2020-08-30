'use strict';

const Joi = require('@hapi/joi');

const { generateError } = require('./helpers');

// Basic Schemas
const searchSchema = Joi.string()
  .min(2)
  .required()
  .error(
    generateError(
      'El campo de búsqueda debe de ser de máis de 2 caracteres',
      400
    )
  );

const emailSchema = Joi.string()
  .email()
  .required()
  .error(generateError('El campo email debe ser un email bien formado', 400));

const roleSchema = Joi.number()
  .valid(1, 2, 3)
  .error(
    generateError(
      'El rol solo puede ser 1 (usuario), 2 (proveedor) o 3 (administrador)',
      400
    )
  );

const passwordSchema = Joi.string()
  .min(6)
  .max(100)
  .required()
  .error(
    generateError('La password debe de tener entre 6 y 100 carateres', 400)
  );

// Object Schemas
const entrySchema = Joi.object().keys({
  place: Joi.string()
    .max(100)
    .required()
    .error(
      generateError(
        'El campo place es obligatorio y no puede tener más de 100 caracteres',
        400
      )
    ),
  description: Joi.string()
    .max(1000)
    .required()
    .error(
      generateError(
        'El campo description es obligatorio y non puede tener más de 1000 caracteres',
        400
      )
    )
});

const voteSchema = Joi.object().keys({
  rating: Joi.number()
    .min(1)
    .max(5)
    .integer()
    .required()
    .error(
      generateError(
        'El campo voto debe existir y ser un número entre 1 y 5',
        400
      )
    ),
  review: Joi.string()
    .allow('')
    .min(1)
    .max(600)
    .error(generateError('El comentario no puede tener más de 600 caracteres'))
});

const userSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema
});

const editUserSchema = Joi.object().keys({
  user_name: Joi.string()
    .min(3)
    .max(30)
    .error(generateError('El nombre debe tener entre 3 y 30 caracteres', 400)),
  last_name: Joi.string()
    .min(3)
    .max(50)
    .error(
      generateError('El apellido deben tener entre 3 y 50 caracteres', 400)
    ),
  birth_date: Joi.any()
    /* .min('1-1-1900')
    .max('1-1-2021') */
    .error(generateError('Fecha incorrecta', 400)),
  gender: Joi.any()
    .valid('Female', 'Male')
    .error(
      generateError(
        'El género debe ser Female (femenino) o Male (masculino)',
        400
      )
    ),
  city_id: Joi.number(),
  email: emailSchema,
  phone: Joi.string()
    .length(9)
    .error(generateError('No es un número de teléfono válido'))
});

const editPasswordUserSchema = Joi.object().keys({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  newPasswordRepeat: Joi.any()
    .valid(Joi.ref('newPassword'))
    .error(generateError('Las passwords debe ser iguales', 400))
});

// TODO Descomentar el id
// Validación de datos de oferta
const offerSchema = Joi.object().keys({
  city_name: Joi.string()
    .min(3)
    .max(255)
    .required()
    .error(
      generateError(
        'El nombre de la ciudad es obligatorio y debe tener un mínimo de 3 caracteres',
        400
      )
    ),
  title: Joi.string()
    .min(6)
    .max(255)
    .required()
    .error(
      generateError(
        'El título es obligatorio y no puede tener más de 255 caracteres',
        400
      )
    ),
  description: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .error(
      generateError('La descripción no puede tener más de mil caracteres', 400)
    ),
  customer_min: Joi.number()
    .min(1)
    .max(25)
    .error(
      generateError(
        'El número mínimo para activar la oferta debe estar entre 1 y 25 usuarios',
        400
      )
    ),
  customer_max: Joi.number()
    .min(1)
    .max(25)
    .error(
      generateError('El número máximo debe estar entre 1 y 25 usuarios', 400)
    ),
  price: Joi.number()
    .precision(2)
    .positive()
    .required()
    .error(generateError('El precio debe ser una cantidad positiva', 400)),
  price_type: Joi.string()
    .valid('hora', 'día', 'semana', 'mes')
    .required()
    .error(
      generateError(
        'El tipo de precio debe ser alguno de los siguientes: hora, día, semana, mes',
        400
      )
    ) /* ,
  categories: Joi.object().keys({
    category: Joi.array().items(
      Joi.number()
        .integer()
        .positive()
        .error(
          generateError(
            'El id de la categoría debe ser un número entero positivo'
          )
        )
    )
  }) */
});

const setSchema = Joi.string()
  .valid('0', '1', '2', '3')
  .error(generateError('El estado de la oferta no es válido', 400));

module.exports = {
  offerSchema,
  entrySchema,
  voteSchema,
  searchSchema,
  userSchema,
  editUserSchema,
  editPasswordUserSchema,
  setSchema
};
