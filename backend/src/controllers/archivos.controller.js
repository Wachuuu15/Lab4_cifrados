const crypto = require("crypto");
const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const Archivo = require("../models/archivo.model");
const User = require("../models/user.model");

exports.guardarArchivo = async (req, res) => {
  try {
    const { clavePrivada, firmar } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ error: "No se proporcionó un archivo" });
    }

    if (!clavePrivada) {
      return res.status(400).json({ error: "No se proporcionó la clave privada" });
    }

    const clavePrivadaClean = clavePrivada.replace(/\\n/g, '\n');

    // Buscar al usuario para obtener el tipo de firma
    const usuario = await User.findOne({ where: { correo: req.user.correo } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const tipoFirma = usuario.tipofirma;
    const archivoContenido = fs.readFileSync(archivo.path, "utf-8");
    const bufferArchivo = Buffer.from(archivoContenido);

    const hash = crypto.createHash("sha256").update(archivoContenido).digest("hex");
    let signature = null;
    let archivoCifrado = null;

    if (firmar === "true") {
      const signer = crypto.createSign("SHA256");

      if (tipoFirma === "RSA") { // Firmar el hash con RSA
        signer.update(hash);
        signer.end();
        signature = signer.sign(clavePrivadaClean, "hex");
      } else if (tipoFirma === "ECC") { // Firmar el hash con ECC
        signer.update(hash);
        signer.end();
        signature = signer.sign(clavePrivadaClean, "hex");
      }
      
    } else { // Cifrar el archivo con RSA usando la clave privada. (SOLO SI el usuario creo sus llaves con RSA)
      if (tipoFirma === "RSA") {
        archivoCifrado = crypto.publicEncrypt(
          { key: usuario.llavepublica, padding: crypto.constants.RSA_PKCS1_PADDING },
          bufferArchivo
        );
      }
    }

    const archivoCifradoNombre = `${Date.now()}_${archivo.originalname}`;
    const archivoCifradoPath = path.join(__dirname, "../../../archivosCifrados", archivoCifradoNombre);

    fs.writeFileSync(archivoCifradoPath, signature ? signature : archivoCifrado ? archivoCifrado : hash);

    // Guardar en BD
    let nuevoArchivo = await Archivo.findOne({ where: { nombre: archivo.originalname } });
    if (nuevoArchivo) {
      nuevoArchivo.correo = req.user.correo;
      nuevoArchivo.nombre = archivo.originalname;
      nuevoArchivo.contenido = archivoCifrado ? archivoCifrado : null;
      nuevoArchivo.hash = hash;
      nuevoArchivo.firma = signature ? signature : null;
      nuevoArchivo.tipofirma = firmar === "true" ? tipoFirma : (firmar === "false" && tipoFirma === "RSA" ? "RSA" : tipoFirma);
      await nuevoArchivo.save();
    }
    else {
      nuevoArchivo = await Archivo.create({
        correo: req.user.correo,
        nombre: archivo.originalname, // seguramente tendre que cambiarlo a archivoCifradoNombre
        contenido: archivoCifrado ? archivoCifrado : null,
        hash,
        firma: signature ? signature : null,
        tipofirma: firmar === "true" ? tipoFirma : (firmar === "false" && tipoFirma === "RSA" ? "RSA" : tipoFirma),
      });
    }

    fs.unlinkSync(archivo.path);

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
    const { verify } = req.query;


    // Buscar el archivo en la base de datos
    const archivo = await Archivo.findOne({ where: { id } });
    if (!archivo) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    // Verificación de firma si se solicita
    if (verify === 'true') {
      const esValido = await verificarFirmaDigital(archivo);
        if (!esValido) {
          return res.status(403).json({ error: "Firma digital no válida" });
        }
    }
    
    // Ruta del archivo cifrado
    const archivoCifradoPath = path.join(__dirname, "../../uploads", archivo.contenido);

    // Verificar si el archivo existe en el sistema de archivos
    if (!fs.existsSync(archivoCifradoPath)) {
      return res.status(404).json({ error: "Archivo cifrado no encontrado en el servidor" });
    }

    // Configurar headers
    res.setHeader('Content-Disposition', `attachment; filename="${archivo.nombre}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream el archivo
    const fileStream = fs.createReadStream(archivoPath);
    fileStream.pipe(res);
    
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      res.status(500).json({ error: "Error al descargar el archivo" });
    }
};

exports.verificarArchivo = async (req, res) => {
  try {
    const { firma, correo } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ error: "No se proporcionó un archivo para verificar" });
    }

    if (!firma || !correo) {
      return res.status(400).json({ error: "Se requiere la firma y el correo del firmante" });
    }

    // Buscar al usuario por su correo
    const usuario = await User.findOne({ where: { correo } });
    if (!usuario || !usuario.llavepublica) {
      return res.status(404).json({ error: "Usuario no encontrado o sin llave pública" });
    }

    const clavePublica = usuario.llavepublica;

    // Leer contenido del archivo
    const contenido = fs.readFileSync(archivo.path);

    // Generar hash SHA-256
    const hash = crypto.createHash("sha256").update(contenido).digest("hex");

    // Verificar firma
    const verifier = crypto.createVerify("SHA256");
    verifier.update(hash);
    verifier.end();

    const esValida = verifier.verify(clavePublica, firma, "hex");

    fs.unlinkSync(archivo.path); // Eliminar archivo temporal

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
      attributes: ["id", "correo", "nombre", "contenido", "hash", "firma", "tipofirma"]
    });

    res.json(archivos);
  } catch (error) {
    console.error("Error al listar archivos:", error);
    res.status(500).json({ error: "Error al listar archivos" });
  }
};