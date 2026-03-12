const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/auth");

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

module.exports = router;
