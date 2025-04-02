require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json()); // Para recibir JSON en las peticiones
app.use(cors()); // Habilitar CORS

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("🔥 Conectado a MongoDB"))
.catch((err) => console.error("❌ Error de conexión:", err));

// Rutas
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/archivos", require("./src/routes/archivos.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
