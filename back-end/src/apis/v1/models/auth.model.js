const db = require("../../../config/database.conf");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

module.exports.Auth = {
  // Kiểm tra username đã tồn tại chưa
  authCheckUsername: async (username) => {
    const sql = "SELECT COUNT(*) AS count FROM Customer WHERE username = ?";
    try {
      const result = await query(sql, [username]);
      return result[0].count > 0;
    } catch (error) {
      console.error("Error in authCheckUsername:", error.message);
      throw error;
    }
  },
  // Kiểm tra email đã tồn tại chưa
  authCheckEmail: async (email) => {
    const sql = "SELECT COUNT(*) AS count FROM Customer WHERE email = ?";
    try {
      const result = await query(sql, [email]);
      return result[0].count > 0;
    } catch (error) {
      console.error("Error in authCheckEmail:", error.message);
      throw error;
    }
  },

  // Đăng ký khách hàng
  authRegister: async (
    name,
    username,
    password,
    balance,
    role_id,
    email,
    phone
  ) => {
    const sql =
      "INSERT INTO Customer (name, username, password, balance, role_id, email, phone) VALUES ( ?, ?, ?, ?, ?, ?, ?)";
    try {
      const result = await query(sql, [
        name,
        username,
        password,
        balance,
        role_id,
        email,
        phone || null,
      ]);
      return { ...result };
    } catch (error) {
      console.error("Error in authRegister:", error.message);
      throw error;
    }
  },

  findUserByUsername: async (username) => {
    const sql = "SELECT * FROM Employee WHERE username = ?";
    try {
      const result = await query(sql, [username]);
      return result[0] || null;
    } catch (error) {
      console.error("Error in findUserByUsername:", error.message);
      throw error;
    }
  },
};
