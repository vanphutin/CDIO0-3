const express = require("express");
const router = express.Router();

const demoRoutes = require("./demo.router");
const authRoutes = require("./auth.router");

router.use("/demo", demoRoutes);
router.use("/auth", authRoutes);

module.exports = (app) => {
  app.use("/api/v1", router);
};
