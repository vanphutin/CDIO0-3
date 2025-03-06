const express = require("express");
const router = express.Router();
const MiddleWare = require("../middlewares/validate.middleware");

const CustomerController = require("../controllers/customer.controller");

router.get(
  "/",
  MiddleWare.verifyToken,
  MiddleWare.isAdminAndEmployee,
  CustomerController.getAllCustomers
);

module.exports = router;
