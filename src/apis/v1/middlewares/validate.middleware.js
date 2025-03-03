const { v4: uuidv4, validate: validateUUID } = require("uuid");

module.exports.validateRegister = (req, res, next) => {
  const { username, password, balance, customer_id } = req.body;

  if (!username || !password || balance === undefined) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields: username, password, or balance",
    });
  }

  if (typeof username !== "string" || username.length < 3) {
    return res.status(400).json({
      status: "error",
      message: "Username must be a string with at least 3 characters",
    });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      status: "error",
      message: "Password must be at least 6 characters long",
    });
  }

  if (typeof balance !== "number" || balance < 0) {
    return res.status(400).json({
      status: "error",
      message: "Balance must be a positive number",
    });
  }

  if (customer_id && !validateUUID(customer_id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid customer_id format (must be UUID v4)",
    });
  }

  next();
};
module.exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role_id !== 1) {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Admins only.",
    });
  }
  next();
};

module.exports.isEmployee = (req, res, next) => {
  if (!req.user || req.user.role_id !== 2) {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Employees only.",
    });
  }
  next();
};
