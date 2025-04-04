const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  correo: {
    type: DataTypes.STRING(255), // Ajuste para el tipo VARCHAR(255)
    allowNull: false,
    unique: true,
    primaryKey: true, // Especificamos que es la clave primaria
  },
  contrasena: {
    type: DataTypes.TEXT, // Tipo TEXT para la contraseña
    allowNull: false,
  },
  llavepublica: {
    type: DataTypes.TEXT, // Tipo TEXT para la llave pública
    allowNull: true, // Puede ser null si no se proporciona
  },
}, {
  tableName: 'usuarios', // Especificamos el nombre de la tabla existente
  timestamps: false, // No se usará createdAt o updatedAt
});

module.exports = User;