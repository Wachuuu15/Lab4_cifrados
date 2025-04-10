const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadsPath = path.join(__dirname, "../../../uploads");

// Crear la carpeta "uploads" si no existe
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const data = { fileName: `${Date.now()}_${file.originalname}`, type: file.mimetype.split('/')[1] };
    req.file = data;
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;