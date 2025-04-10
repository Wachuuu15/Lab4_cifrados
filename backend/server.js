require('dotenv').config();
const express = require("express");
const sequelize = require("./src/config/db");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());

// Sincronizar base de datos
sequelize.sync({ force: false })
  .then(() => console.log("📦 Base de datos sincronizada"))
  .catch(err => console.error("❌ Error al sincronizar:", err));

// Rutas
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/archivos", require("./src/routes/archivos.routes"));
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando correctamente! 🚀");
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});