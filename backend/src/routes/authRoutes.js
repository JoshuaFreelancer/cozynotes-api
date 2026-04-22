const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");

// These routes need to be completely public
router.post("/register", register);
router.post("/login", login);

module.exports = router;
