const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "Acceso denegado: Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userEmail) {
      return res.status(401).json({ error: "Token inválido." });
    }

    const user = await User.findOne({ where: { correo: decoded.userEmail } });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    req.user = {
      id: user.correo,
      correo: user.correo,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "El token ha expirado. Por favor, inicia sesión nuevamente." });
    }
    res.status(401).json({ error: `Token inválido: ${error.message}` });
  }
};