const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT, 10),
});

// Función para validar las credenciales de usuario
async function validateUserCredentials(carnet, password) {
  try {
    const [users] = await pool.query("SELECT * FROM usuario WHERE CARNET = ?", [carnet]);

    if (users.length === 0) {
      return null;
    }

    const usuario = users[0];
    // Comparar contraseñas en texto plano
    if (password === usuario.CONTRASENA) {
      return {
        ID: usuario.ID,
        NOMBRE: usuario.NOMBRE,
        APELLIDO: usuario.APELLIDO,
        CORREO: usuario.CORREO,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error al validar credenciales en validateUserCredentials:", err.message);
    throw err;
  }
}

// Modificación en getEnabledLessons en database.js
async function getEnabledLessons(level) {
  try {
    const [lessons] = await pool.query(
      "SELECT l.ID, l.NOMBRE FROM lecciones l JOIN nivel_educativo ne ON l.ID_NIVEL = ne.ID WHERE l.ESTADO = 'HABILITADO' AND ne.NOMBRE = ?",
      [level]
    );
    return lessons;
  } catch (err) {
    console.error("Error al obtener lecciones en getEnabledLessons:", err.message);
    throw err;
  }
}

// Exportar los módulos
module.exports = {
  pool,
  validateUserCredentials,
  getEnabledLessons,  // Exportamos la nueva función
};
