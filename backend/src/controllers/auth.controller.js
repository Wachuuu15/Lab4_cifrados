const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.register = async (req, res) => {
  try {
    const { correo, contrasena, llavepublica } = req.body;
    
    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
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

    const user = await User.findOne({ where: { correo: email } });

    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ userEmail: user.correo }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
};

exports.verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No se proporcionó un token" });
  }

  const token = authHeader;

  if (!token) {
    return res.status(401).json({ error: "Token no válido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ error: `Token inválido: ${error.message}` });
  }
};

exports.generateKeys = async (req, res) => {
  const { algorithm } = req.body; // ECC o RSA
  if (!algorithm || (algorithm !== "RSA" && algorithm !== "ECC")) {
    return res.status(400).json({ message: "Debe especificar un algoritmo válido: 'RSA' o 'ECC'." });
  }
  const userEmail = req.user.correo;

  if (!userEmail) {
    return res.status(400).json({ message: "No se encontró el correo del usuario." });
  }

  try {
    let publicKey, privateKey;

    if (algorithm === "RSA") {
      // Generar llaves RSA
      const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
      });
      publicKey = pubKey.export({ type: "pkcs1", format: "pem" });
      privateKey = privKey.export({ type: "pkcs1", format: "pem" });
    } else if (algorithm === "ECC") {
      // Generar llaves ECC
      const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync("ec", {
        namedCurve: "secp256k1",
      });
      publicKey = pubKey.export({ type: "spki", format: "pem" });
      privateKey = privKey.export({ type: "pkcs8", format: "pem" });
    } else {
      return res.status(400).json({ message: "Algoritmo no soportado. Use 'RSA' o 'ECC'." });
    }

    await savePublicKeyToDatabase(userEmail, publicKey, algorithm); // Guarda llave en BD

    res.status(200).json({ privateKey });
  } catch (error) {
    console.error("Error al generar las llaves:", error);
    res.status(500).json({ message: `Error al generar las llaves: ${error.message}` });
  }
};

const savePublicKeyToDatabase = async (userEmail, publicKey, algorithm) => {
  const user = await User.findOne({ where: { correo: userEmail } });
  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  user.llavepublica = publicKey;
  user.tipofirma = algorithm;
  await user.save();
};


exports.getPublicKey = async (req, res) => {
  try {
    const { correo } = req.params;

    // Buscar al usuario por correo
    const user = await User.findOne({ where: { correo } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Retornar la llave pública o null si no existe
    res.json({ llavepublica: user.llavepublica || null });
  } catch (error) {
    console.error("Error al obtener la llave pública:", error);
    res.status(500).json({ error: "Error al obtener la llave pública" });
  }
};