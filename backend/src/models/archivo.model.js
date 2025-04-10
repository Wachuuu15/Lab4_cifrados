const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Archivo = sequelize.define("Archivo", {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    correo: {
    type: DataTypes.STRING(255),
    allowNull: false
    },
    nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
    },
    contenido: {
    type: DataTypes.TEXT,
    allowNull: false
    },
    hash: {
    type: DataTypes.TEXT,
    allowNull: false
    },
    tipofirma: {
    type: DataTypes.STRING(10),
    allowNull: false
    }
}, {
    tableName: "archivos", // Nombre exacto de la tabla en la BD
    timestamps: false      // Desactiva createdAt y updatedAt si no los estás usando
});

module.exports = Archivo;
  