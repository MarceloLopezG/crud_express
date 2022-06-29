const express = require('express');
const controller = require("../controllers/login.controller");
const authRoutes = express.Router();


authRoutes.post("/login", controller.login); // Log in

module.exports = authRoutes;