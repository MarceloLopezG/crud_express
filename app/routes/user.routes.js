const express = require('express');
const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const { verifySignUp } = require("../middleware");
const userRoutes = express.Router();


// Public access
userRoutes.post("/signup", [verifySignUp.isEmailExist], controller.signup);
userRoutes.get("/all", controller.allAccess);


// Access restricted by JWT
// Customer
userRoutes.get("/my-account/:username", [authJwt.verifyToken, authJwt.isCustomerRole], controller.getUserByUsername);
userRoutes.put("/my-account/update/:username", [authJwt.verifyToken, authJwt.isCustomerRole], controller.updateAccount);

// Administrator
userRoutes.get("/my-account-admin/:username", [authJwt.verifyToken, authJwt.isAdminRole], controller.getUserByUsername);
userRoutes.get("/admin-board", [authJwt.verifyToken, authJwt.isAdminRole], controller.adminBoard);
userRoutes.delete("/delete-user/:id", [authJwt.verifyToken, authJwt.isAdminRole], controller.delete);


module.exports = userRoutes;