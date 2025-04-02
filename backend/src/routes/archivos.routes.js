const express = require("express");
const { guardarArchivo, descargarArchivo, verificarArchivo } = require("../controllers/archivos.controller");
const authenticate = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/guardar", authenticate, guardarArchivo);
router.get("/:id/descargar", authenticate, descargarArchivo);
router.post("/verificar", verificarArchivo);

module.exports = router;
