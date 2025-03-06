const { v4: uuidv4, validate: validateUUID } = require("uuid");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
// Hàm helper để trả lỗi chuẩn API
const sendError = (res, message) =>
  res.status(400).json({ status: "error", message });

// Middleware kiểm tra dữ liệu đăng ký
module.exports.validateRegister = (req, res, next) => {
  const { username, password, balance, email, phone, name } = req.body;

  if (!req.body) return sendError(res, "Request body is missing");

  const missingFields = [];
  if (!email) missingFields.push("email");
  if (!name) missingFields.push("name");
  if (!username) missingFields.push("username");
  if (!password) missingFields.push("password");
  if (balance === undefined) missingFields.push("balance");

  if (missingFields.length > 0) {
    return sendError(
      res,
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }

  if (typeof username !== "string" || username.length < 3)
    return sendError(
      res,
      "Username must be a string with at least 3 characters"
    );

  if (typeof password !== "string" || password.length < 6)
    return sendError(res, "Password must be at least 6 characters long");

  if (typeof balance !== "number" || balance < 0)
    return sendError(res, "Balance must be a positive number");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return sendError(res, "Invalid email format");

  if (phone && !/^\d{10,15}$/.test(phone))
    return sendError(res, "Invalid phone number format (must be 10-15 digits)");

  next();
};

// Middleware kiểm tra quyền Admin
module.exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 1) {
    return res
      .status(403)
      .json({ status: "error", message: "Access denied. Admins only." });
  }
  next();
};

// Middleware kiểm tra quyền Employee
module.exports.isEmployee = (req, res, next) => {
  if (!req.user || req.user.role !== 2) {
    return res
      .status(403)
      .json({ status: "error", message: "Access denied. Employees only." });
  }
  next();
};

// Middleware kiểm tra quyền Employee & Admin
module.exports.isAdminAndEmployee = (req, res, next) => {
  if (!req.user || (req.user.role !== 1 && req.user.role !== 2)) {
    return res.status(403).json({ status: "error", message: "Access denied." });
  }
  next();
};

// Middleware kiểm tra login
module.exports.validateLogin = (req, res, next) => {
  if (!req.body || !req.body.username || !req.body.password) {
    return sendError(res, "Missing required fields: username and password");
  }
  next();
};

module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: "error", message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Lấy token từ header
  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Giải mã token

    req.user = decoded; // Lưu user vào request
    next();
  } catch (error) {
    console.error("JWT Verify Error:", error.message);
    return res.status(401).json({ status: "error", message: "Invalid token" });
  }
};
