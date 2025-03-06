const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const MiddleWare = require("../middlewares/validate.middleware");
router.post(
  "/register-customer",
  MiddleWare.verifyToken,
  MiddleWare.isAdminAndEmployee,
  MiddleWare.validateRegister,
  AuthController.registerCustomer
);

router.post("/login", MiddleWare.validateLogin, AuthController.login);

module.exports = router;
