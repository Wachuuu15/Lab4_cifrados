const bcrypt = require("bcryptjs");
const crypto = require("crypto");
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

    await savePublicKeyToDatabase(userEmail, publicKey); // Guarda llave en BD

    // Retornar la llave privada para descarga (saber si sí funciona)
    res.setHeader("Content-Disposition", "attachment; filename=private_key.pem");
    res.setHeader("Content-Type", "application/x-pem-file");
    res.status(200).send(privateKey);
  } catch (error) {
    console.error("Error al generar las llaves:", error);
    res.status(500).json({ message: `Error al generar las llaves: ${error.message}` });
  }
};

const savePublicKeyToDatabase = async (userEmail, publicKey) => {
  const user = await User.findOne({ where: { correo: userEmail } });
  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  user.llavepublica = publicKey;
  await user.save();
};