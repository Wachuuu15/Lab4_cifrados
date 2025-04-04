const { Sequelize } = require("sequelize");

// Configurar conexión a PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false, // Desactiva logs de SQL en consola
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a PostgreSQL");
  } catch (error) {
    console.error("❌ Error al conectar a PostgreSQL:", error);
  }
};

testConnection();

module.exports = sequelize;
