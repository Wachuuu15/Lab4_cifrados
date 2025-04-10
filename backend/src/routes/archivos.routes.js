const express = require("express");
const { guardarArchivo, descargarArchivo, verificarArchivo, listarArchivos } = require("../controllers/archivos.controller");
const authenticate = require("../middlewares/auth.middleware");
const upload = require("../middlewares/archivos.middleware");
const router = express.Router();

router.get("/", authenticate, listarArchivos);
router.post("/guardar", authenticate, upload.single("file"), guardarArchivo);
router.get("/:id/descargar", authenticate, descargarArchivo);
router.post("/verificar", verificarArchivo);

module.exports = router;
