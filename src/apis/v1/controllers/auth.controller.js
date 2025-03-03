const { Auth } = require("../models/auth.model");
const DEFAULT_ROLE_CUSTOMER = 3;
const { v4: uuidv4 } = require("uuid");

module.exports.registerCustomer = async (req, res) => {
  const { name, username, password, balance } = req.body;
  const customer_id = uuidv4();
  if (!name || !username || !password || balance === undefined) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields:name, username, password, or balance",
    });
  }

  try {
    const newCustomer = await Auth.authRegister(
      name,
      username,
      password,
      balance,
      DEFAULT_ROLE_CUSTOMER
    );

    return res.status(201).json({
      status: "success",
      data: newCustomer,
    });
  } catch (error) {
    console.error("Error in registerCustomer:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
