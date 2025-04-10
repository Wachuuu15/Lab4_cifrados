const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const Archivo = require("../models/archivo.model");

exports.guardarArchivo = async (req, res) => {
  try {
    const { clavePrivada, firmar } = req.body; // `firmar` indica si se debe firmar el archivo
    const archivo = req.file;
    const usuarioCorreo = req.user.correo; // Correo del usuario autenticado

    if (!archivo) {
      return res.status(400).json({ error: "No se proporcionó un archivo" });
    }

    // Leer el contenido del archivo
    const archivoContenido = fs.readFileSync(archivo.path);

    // Cifrar el archivo con RSA usando la clave privada
    const bufferArchivo = Buffer.from(archivoContenido);
    const archivoCifrado = crypto.privateEncrypt(
      { key: clavePrivada, padding: crypto.constants.RSA_PKCS1_PADDING },
      bufferArchivo
    );

    let hash = null;
    let signature = null;

    if (firmar) {
      // Generar hash SHA-256 del archivo
      hash = crypto.createHash("sha256").update(archivoContenido).digest("hex");

      // Firmar el hash con la clave privada
      const signer = crypto.createSign("SHA256");
      signer.update(hash);
      signer.end();
      signature = signer.sign(clavePrivada, "hex");
    }

    // Crear un nombre único para el archivo cifrado
    const archivoCifradoNombre = `${Date.now()}_${archivo.originalname}.enc`;
    const archivoCifradoPath = path.join(__dirname, "../../../archivos_cifrados", archivoCifradoNombre);

    // Guardar el archivo cifrado en el sistema de archivos
    fs.writeFileSync(archivoCifradoPath, archivoCifrado);

    // Guardar los metadatos del archivo en la base de datos
    const nuevoArchivo = await Archivo.create({
      correo: usuarioCorreo,
      nombre: archivo.originalname,
      contenido: archivoCifradoNombre, // Nombre del archivo cifrado
      hash: hash || null,
      tipofirma: firmar === "true" ? "RSA" : "N/A", // Indicar si fue firmado
    });

    // Eliminar el archivo original para ahorrar espacio
    fs.unlinkSync(archivo.path);

    // Responder con los datos del archivo
    res.json({
      message: "Archivo guardado exitosamente",
      archivoId: nuevoArchivo.id,
      hash,
      signature,
      archivoCifradoPath,
    });
  } catch (error) {
    console.error("Error al guardar el archivo:", error);
    res.status(500).json({ error: "Error al guardar el archivo" });
  }
};

exports.descargarArchivo = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el archivo en la base de datos
    const archivo = await Archivo.findOne({ where: { id } });
    if (!archivo) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    // Buscar la llave pública del usuario que subió el archivo
    const usuario = await User.findOne({ where: { correo: archivo.correo } });
    if (!usuario || !usuario.llavepublica) {
      return res.status(404).json({ error: "Llave pública del usuario no encontrada" });
    }

    // Ruta del archivo cifrado
    const archivoCifradoPath = path.join(__dirname, "../archivos_cifrados", archivo.contenido);

    // Verificar si el archivo existe en el sistema de archivos
    if (!fs.existsSync(archivoCifradoPath)) {
      return res.status(404).json({ error: "Archivo cifrado no encontrado en el servidor" });
    }

    // Enviar el archivo cifrado y la llave pública
    res.download(archivoCifradoPath, archivo.nombre, (err) => {
      if (err) {
        console.error("Error al enviar el archivo:", err);
        res.status(500).json({ error: "Error al descargar el archivo" });
      }
    });
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
    res.status(500).json({ error: "Error al descargar el archivo" });
  }
};

exports.verificarArchivo = async (req, res) => {
  try {
    const { firma, clavePublica } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ error: "No se proporcionó un archivo para verificar" });
    }

    if (!firma || !clavePublica) {
      return res.status(400).json({ error: "Se requiere la firma y la clave pública" });
    }

    // Leer el contenido del archivo
    const contenido = fs.readFileSync(archivo.path);

    // Generar el hash SHA-256 del archivo
    const hash = crypto.createHash("sha256").update(contenido).digest("hex");

    // Verificar la firma con la clave pública
    const verifier = crypto.createVerify("SHA256");
    verifier.update(hash);
    verifier.end();

    const esValida = verifier.verify(clavePublica, firma, "hex");

    // Eliminar archivo temporal
    fs.unlinkSync(archivo.path);

    if (esValida) {
      res.json({ mensaje: "Firma verificada exitosamente", valido: true });
    } else {
      res.status(400).json({ mensaje: "Firma inválida", valido: false });
    }

  } catch (error) {
    console.error("Error al verificar el archivo:", error);
    res.status(500).json({ error: "Error interno al verificar la firma" });
  }
};


exports.listarArchivos = async (req, res) => {
  try {
    const archivos = await Archivo.findAll({
      attributes: ["id", "correo", "nombre", "contenido", "hash", "tipofirma"]
    });

    res.json(archivos);
  } catch (error) {
    console.error("Error al listar archivos:", error);
    res.status(500).json({ error: "Error al listar archivos" });
  }
};