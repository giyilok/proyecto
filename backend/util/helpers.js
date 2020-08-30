'use strict';

const { format } = require('date-fns');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const uuid = require('uuid');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

//const imageUploadPath = path.join(__dirname, process.env.UPLOADS_DIR);
const imageUploadPath = path.resolve('public', process.env.UPLOADS_DIR);

// Formatea una fecha para que se pueda pasar a la db
function formatDateToDB(date) {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

// Nombre, procesa, guarda una imagen en archivo y devuelve el nombre codificado
async function processAndSavePhoto(uploadedImage) {
  // Random File name to be saved
  const savedFileName = `${uuid.v1()}.jpg`;

  // Ensure the uploads path exists
  await fs.ensureDir(imageUploadPath);

  // Process image
  const finalImage = sharp(uploadedImage.data);

  // Check image size
  const imageInfo = await finalImage.metadata();

  // If image is wider than 500px resize it
  if (imageInfo.width > 500) {
    finalImage.resize(500);
  }

  // Save image
  await finalImage.toFile(path.join(imageUploadPath, savedFileName));

  return savedFileName;
}

// Borra una foto
async function deletePhoto(imagePath) {
  await fs.unlink(path.join(imageUploadPath, imagePath));
}

// Devuelve una cadena aleatoria de 20 caracteres
function randomString(size = 20) {
  return crypto.randomBytes(size).toString('hex').slice(0, size);
}

// Manda un mail con sendgrid
async function sendEmail({ email, title, content }) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: 'giyilok@gmail.com',
    subject: title,
    text: content,
    html: `<div>
      <h1></h1>
      <p>${content}</p>  
    </div>`
  };

  await sgMail.send(msg);
}

// Crea un error tipo
function generateError(message, code) {
  const error = new Error(message);
  if (code) error.httpCode = code;
  return error;
}

module.exports = {
  formatDateToDB,
  processAndSavePhoto,
  deletePhoto,
  randomString,
  sendEmail,
  generateError
};
