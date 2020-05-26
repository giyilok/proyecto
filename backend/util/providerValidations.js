'use strict';

const Joi = require('@hapi/joi');

const { generateError } = require('./helpers');

// Basic Schemas
const searchSchema = Joi.string()
  .min(2)
  .required()
  .error(
    generateError('El campo de búsqueda debe ser de más de 2 caracteres', 400)
  );

// Object Schemas
const providerSchema = Joi.object().keys({
  init_work_at: Joi.number()
    //.min(1970)
    .max(2021)
    .error(
      generateError(
        'La año de comienzo de tu carrera profesional tiene que estar entre 1970 y 2021',
        400
      )
    ),
  biography: Joi.string()
    .allow('')
    .min(0)
    .max(10000)
    .error(
      generateError('La biografía no puede tener más de 10000 caracteres', 400)
    ),
  speciality: Joi.string()
    .allow('')
    .min(1)
    .max(255)
    .error(
      generateError('La especialidad no puede tener más de 255 caracteres')
    )
});

const voteSchema = Joi.object().keys({
  vote: Joi.number()
    .min(1)
    .max(5)
    .integer()
    .required()
    .error(
      generateError('La valoración debe ser un número entero entre 1 y 5', 400)
    )
});

module.exports = {
  providerSchema,
  voteSchema,
  searchSchema
};
