const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

exports.guardarArchivo = async (req, res) => {
  try {
    const { firma, clavePrivada } = req.body;
    const archivo = req.file;

    // Generar hash SHA-256 del archivo
    const hash = crypto.createHash("sha256").update(fs.readFileSync(archivo.path)).digest("hex");

    // Firmar el hash con la clave privada
    const signer = crypto.createSign("SHA256");
    signer.update(hash);
    signer.end();
    const signature = signer.sign(clavePrivada, "hex");

    res.json({ message: "Archivo guardado y firmado", hash, signature });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el archivo" });
  }
};

exports.descargarArchivo = async (req, res) => {
  // Implementación para descargar archivos
};

exports.verificarArchivo = async (req, res) => {
  // Implementación para verificar la firma del archivo
};
