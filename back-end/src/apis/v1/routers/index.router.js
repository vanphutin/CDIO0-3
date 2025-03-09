const express = require("express");
const router = express.Router();

const demoRoutes = require("./demo.router");
const authRoutes = require("./auth.router");
const customerRoutes = require("./customer.router");

router.use("/demo", demoRoutes);
router.use("/auth", authRoutes);
router.use("/customers", customerRoutes);

module.exports = (app) => {
  app.use("/api/v1", router);
};
