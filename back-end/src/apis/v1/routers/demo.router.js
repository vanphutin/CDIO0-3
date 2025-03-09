const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const MiddleWare = require("../middlewares/validate.middleware");

router.post(
  "/register-customer",

  MiddleWare.validateRegister,
  AuthController.registerCustomer
);

module.exports = router;
