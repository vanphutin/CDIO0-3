// src/apis/v1/controllers/auth.controller.js
const { Auth } = require("../models/auth.model");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const SALT_ROUNDS = 10;
const DEFAULT_ROLE_CUSTOMER = 3;
const jwt = require("jsonwebtoken");

module.exports.registerCustomer = async (req, res) => {
  const { name, username, password, balance, email, phone } = req.body;

  const missingFields = [];
  if (!email) missingFields.push("email");
  if (!name) missingFields.push("name");
  if (!username) missingFields.push("username");
  if (!password) missingFields.push("password");
  if (balance === undefined) missingFields.push("balance");

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: "error",
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    // Kiểm tra username đã tồn tại chưa
    const usernameExists = await Auth.authCheckUsername(username);
    if (usernameExists) {
      return res.status(400).json({
        status: "error",
        message: "Username already exists",
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const emailExists = await Auth.authCheckEmail(email);
    if (emailExists) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    // Mã hóa mật khẩu trước khi lưu vào database
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newCustomer = await Auth.authRegister(
      name,
      username,
      hashedPassword,
      balance,
      DEFAULT_ROLE_CUSTOMER,
      email,
      phone
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

// login
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

module.exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Auth.findUserByUsername(username);
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }

    // Tạo accessToken và refreshToken
    const accessToken = jwt.sign(
      { userId: user.employee_id, role: user.role_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.employee_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const userInfo = {
      employee_id: user.employee_id,
      name: user.name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      role_id: user.role_id,
    };

    return res.json({
      status: "success",
      data: {
        accessToken,
        refreshToken,
        user: userInfo,
        expiresIn: "24h",
      },
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ accessToken });
  });
};
