// src/utils/main.js
// Archivo de utilidad para funciones de Autenticación y Lógica General

// Clave para guardar el usuario en localStorage
const USER_STORAGE_KEY = 'currentUser';

// Expresión regular para validar los correos según el requisito (duocuc.cl, profesor.duoc.cl, gmail.com)
const EMAIL_REGEX = /^[\w.+-]+@(duocuc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

// --- LÓGICA DE AUTENTICACIÓN (RF-07 y RF-08) ---
// Datos Mocks de usuarios, actualizados con la lógica de correo/contraseña del requisito.

// NOTA IMPORTANTE: Esta lista es mutable para simular el registro de nuevos usuarios
const MOCK_USERS = [
    // Usuario Administrador (Actualizado a José Vásquez y correo corregido)
    { username: 'jos.vasquezz@duocuc.cl', password: '123456', name: 'José Vásquez', isAdmin: true, id: 1 },
    // Usuarios Normales (correo y password '123')
    { username: 'usuario1@duocuc.cl', password: '123', name: 'Usuario 1', isAdmin: false, id: 2 },
    { username: 'usuario2@gmail.com', password: '123', name: 'Usuario 2', isAdmin: false, id: 3 },
    { username: 'profesor1@profesor.duoc.cl', password: '123', name: 'Profesor 1', isAdmin: false, id: 4 },
];

/**
 * Simula el inicio de sesión. El 'username' se trata como el correo electrónico.
 * Implementa la validación de formato de correo.
 * @param {string} username - Correo electrónico.
 * @param {string} password
 * @returns {object|null} Objeto de usuario si el login es exitoso, null si falla.
 */
export const login = (username, password) => {
    // 1. Validar el formato del correo
    if (!EMAIL_REGEX.test(username)) {
        console.error("Error de login: Correo no válido. Debe ser duocuc.cl, profesor.duoc.cl o gmail.com");
        return null;
    }

    // 2. Buscar usuario
    const user = MOCK_USERS.find(
        u => u.username === username && u.password === password
    );

    if (user) {
        // Creamos un objeto limpio sin la contraseña para guardar
        const userSession = { name: user.name, username: user.username, isAdmin: user.isAdmin, id: user.id };

        // 3. Guardar en localStorage para persistencia
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userSession));

        console.log(`Usuario ${user.username} ha iniciado sesión.`);
        return userSession;
    }

    console.error("Error de login: Correo o contraseña incorrectos.");
    return null;
};

/**
 * Simula el registro de un nuevo usuario y automáticamente inicia sesión.
 * Implementa validación de formato, longitud de contraseña y duplicados.
 * @param {object} newUserData - { username (correo), password, name }
 * @returns {object|null} El nuevo objeto de usuario si es exitoso, null si falla.
 */
export const register = (newUserData) => {
    // 1. Validar el formato del correo
    if (!EMAIL_REGEX.test(newUserData.username)) {
        console.error("Error de registro: Correo no válido. Debe ser duocuc.cl, profesor.duoc.cl o gmail.com");
        return null;
    }

    // Nueva Validación: Longitud de la contraseña (4 a 10 caracteres)
    const password = newUserData.password || '';
    if (password.length < 4 || password.length > 10) {
        console.error("Error de registro: La contraseña debe tener entre 4 y 10 caracteres.");
        return null;
    }

    // 2. Validar si el usuario ya existe (simple)
    const existingUser = MOCK_USERS.find(u => u.username === newUserData.username);
    if (existingUser) {
        console.error("Error de registro: El nombre de usuario (correo) ya existe.");
        return null;
    }

    // 3. Crear y agregar nuevo usuario (mutable)
    const newUser = {
        ...newUserData,
        isAdmin: false,
        id: MOCK_USERS.length + 1
    };
    MOCK_USERS.push(newUser);

    // 4. Iniciar sesión y guardar en localStorage
    const userSession = { name: newUser.name, username: newUser.username, isAdmin: newUser.isAdmin, id: newUser.id };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userSession));

    console.log(`Usuario ${newUser.username} registrado e iniciado sesión.`);
    return userSession;
};

/**
 * Cierra la sesión y elimina la información de localStorage.
 */
export const logout = () => {
    // Eliminar de localStorage
    localStorage.removeItem(USER_STORAGE_KEY);
    console.log("Sesión cerrada.");
};

/**
 * Obtiene la información de usuario desde localStorage para restaurar la sesión.
 * @returns {object|null}
 */
export const getUserInfo = () => {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (userJson) {
        try {
            return JSON.parse(userJson);
        } catch (e) {
            console.error("Error al parsear la sesión de usuario desde localStorage:", e);
            localStorage.removeItem(USER_STORAGE_KEY); // Limpia si está corrupto
            return null;
        }
    }
    return null;
};

