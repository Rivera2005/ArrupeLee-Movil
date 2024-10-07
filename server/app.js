const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { validateUserCredentials, getEnabledLessons } = require("./database.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Login endpoint
app.post("/login", async (req, res) => {
  const { carnet, password } = req.body;

  if (!carnet || !password) {
    console.error("Mensaje enviado: Missing carnet or password");
    return res.status(400).json({ success: false, message: "Missing carnet or password" });
  }

  try {
    const user = await validateUserCredentials(carnet, password);
    if (user) {
      console.log("Mensaje enviado: Inicio de sesión exitoso. ¡Bienvenido de nuevo!");
      return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso. ¡Bienvenido!",
        ID: user.ID,
        NOMBRE: user.NOMBRE,
        APELLIDO: user.APELLIDO,
        CORREO: user.CORREO,
      });
    } else {
      console.error("Mensaje enviado: Credenciales inválidas");
      return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Agrega el endpoint para lecciones con el nivel
app.get("/lessons", async (req, res) => {
  const { level } = req.query; // Obtener el nivel desde los parámetros de consulta

  try {
    const lessons = await getEnabledLessons(level); // Pasar el nivel a la función
    res.status(200).json(lessons);
  } catch (error) {
    console.error("Error al obtener lecciones:", error.message);
    res.status(500).json({ success: false, message: "Error al obtener lecciones" });
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
