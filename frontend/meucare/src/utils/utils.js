"use strict";

import axios from "axios";
import jwt from "jwt-decode";

const ENDPOINT = "http://localhost:3001";
const AUTH_TOKEN_KEY = "authToken";
const ROLE = "role";
const NAME = "name";
const ID = "id";

// Función de login
export async function loginUser(email, password) {
  //return new Promise(async (resolve, reject) => {
  try {
    let response = await axios({
      url: `${ENDPOINT}/user/login`, // URL de la autenticación
      method: "POST", // Método de la autenticación
      data: {
        email: email,
        password: password,
        //grant_type: "password",
      },
    });

    console.log(response);
    //const { token, role, userName } = response.data;

    const { token } = response.data.tokenData;
    console.log(token);
    // Extraemos los datos del token
    const { id, role, userName } = jwt(token);
    // Guardamos los datos en el localstorage
    setAuthToken(token);
    setRole(role);
    setUserName(userName);
    setUserId(id);
  } catch (error) {
    throw error;
  }
}

// Logout
export function clearLogin() {
  // Borramos la cabecera Authorization de las peticiones
  axios.defaults.headers.common["Authorization"] = "";
  // Borramos los datos del usuario del localstorage
  clearAuthToken();
  clearRole();
  clearUserName();
  clearUserName();
}

/*** Funciones para trabajar con el token */

// Guardar token el localstorage
export function setAuthToken(token) {
  // Ponemos la cabecera de las peticiones un header tipo
  // Authorization Bearer + token
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

// Borrar el token del localstorage
export function clearAuthToken() {
  return localStorage.removeItem(AUTH_TOKEN_KEY);
}

// Coger el token del localstorage para ver si existe
export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Consiguiendo fecha de expiración o caducidad del token
export function getTokenExpirationDate(encodedToken) {
  let token = jwt(encodedToken);
  // Si no tiene fecha de expiración, no sigue
  if (!token.exp) {
    return null;
  }

  let date = new Date(0);
  date.setUTCSeconds(token.exp);
  return date;
}

// Comprobando  si la fecha sigue vigente o no
export function isTokenExpired(token) {
  let expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}

// Comprobar si el usuario está logueado o no
export function isLoggedIn() {
  let authToken = getAuthToken();
  return !!authToken && !isTokenExpired(authToken);
}

/***  Funciones para comprobar el rol del user ***/

// Guardar rol de usuario en localStorage
export function setRole(role) {
  localStorage.setItem(ROLE, role); // Aquí figuraba .setItem({ROLE, role})
}

// Guardar el nombre como identificador del usuario en el localstorage
export function setUserName(name) {
  localStorage.setItem(NAME, name);
}

// Guarda en el localstorage el id del usuario
export function setUserId(id) {
  localStorage.setItem(ID, id);
}

// Borrar rol del usuario del localstorage
export function clearRole() {
  return localStorage.removeItem(ROLE);
}

// Borrar el nombre del usuario del localstorage
export function clearUserName() {
  return localStorage.removeItem(NAME);
}

// Borrar el id del usuario del localstorage
export function clearUserId() {
  return localStorage.removeItem(ID);
}

// Recuperar el role que se ha guardado en localStorage
export function getRole() {
  return localStorage.getItem(ROLE);
}

// Recuperar el nombre del usuario del localstorage
export function getUserName() {
  return localStorage.getItem(NAME);
}

// Recuperar el id del usuario del localstorage
export function getUserId() {
  return localStorage.getItem(ID);
}

// Comprobar rol
/* export function checkAdmin() {
  let role = false;
  let isAdmin = getIsAdmin();
  if (isAdmin === "true") {
    role = true;
  } else {
    role = false;
  }

  return role;
} */
