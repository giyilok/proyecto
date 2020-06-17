"use strict";

import axios from "axios";
import jwt from "jwt-decode";

const ENDPOINT = "http://localhost:3001";
const AUTH_TOKEN_KEY = "authToken";
const ROLE = "role";

// Función de login
export function loginUser(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await axios({
          url: `${ENDPOINT}/auth`, // URL de la autenticación
          method: "POST", // Método de la autenticación
          data: {
            email: email,
            password: password,
            grant_type: "password",
          },
        });
  
        setAuthToken(res.data.token);
  
        setIsAdmin(res.data.isAdmin);
  
        // Añadimos el email al localstorage para identificar
        // al usuario en el menú
        setEmail(res.data.email);
        localStorage.setItem("email", email);
  
        resolve();
      } catch (err) {
        console.log("Error en login: ", err);
        reject(err);
      }
    });
  }
  
  // Guardar token el localstorage
  export function setAuthToken(token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log(token);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  
  // Logout
  export function clearLogin() {
    axios.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem("email");
  
    clearAdmin();
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
  
  // Guardar admin en localStorage
  export function setIsAdmin(isAdmin) {
    localStorage.setItem(ROLE, isAdmin); // Aquí figuraba .setItem({ROLE, isAdmin})
  }
  
  // Borrar rol del user del localstorage
  export function clearAdmin() {
    return localStorage.removeItem(ROLE);
  }
  
  // Guardar el email como identificador en el localstorage
  export function setEmail(email) {
    localStorage.setItem("email", email);
  }
  
  // Recuperar el role que se ha guardado en localStorage
  export function getIsAdmin() {
    return localStorage.getItem(ROLE);
  }
  
  // Comprobar rol
  export function checkAdmin() {
    let role = false;
    let isAdmin = getIsAdmin();
    if (isAdmin === "true") {
      role = true;
    } else {
      role = false;
    }
  
    return role;
