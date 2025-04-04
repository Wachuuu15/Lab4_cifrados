require('dotenv').config();
const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./src/config/db");

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // Para recibir JSON en las peticiones

// Sincronizar base de datos
sequelize.sync({ force: false }) // Si es `true`, borra y recrea las tablas en cada inicio
  .then(() => console.log("📦 Base de datos sincronizada"))
  .catch(err => console.error("❌ Error al sincronizar:", err));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
});

// Rutas
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/archivos", require("./src/routes/archivos.routes"));
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando correctamente! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
