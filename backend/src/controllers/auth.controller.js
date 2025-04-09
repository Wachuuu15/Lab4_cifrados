const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.register = async (req, res) => {
  try {
    const { correo, contrasena, llavepublica } = req.body;
    
    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear nuevo usuario
    await User.create({ 
      correo, 
      contrasena: hashedPassword, 
      llavepublica
    });

    res.json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error en el registro:", error);  // Agregar esta línea para imprimir el error completo en la consola
    res.status(500).json({ error: `Error en el registro: ${error.message}` }); // Devuelve un mensaje más detallado
  }
};

exports.login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
};
