const express = require("express");
const { login, register, verifyToken, generateKeys } = require("../controllers/auth.controller");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/register", register);
router.get("/verify", authenticate, verifyToken);
router.post("/generate-keys", authenticate, generateKeys);

module.exports = router;
