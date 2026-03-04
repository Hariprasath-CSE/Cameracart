const express = require("express");
// const Student = require("../models/Student");

const { registerUser, loginUser } = require("../controller/authController");

const router = express.Router();

// "/students"
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
