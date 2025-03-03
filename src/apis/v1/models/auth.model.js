const db = require("../../../config/database.conf");
const { promisify } = require("util");

const query = promisify(db.query).bind(db);

module.exports.Auth = {
  // Đăng ký khách hàng
  authRegister: async (name, username, password, balance, role_id) => {
    const sql =
      "INSERT INTO Customer (name, username, password, balance, role_id) VALUES ( ?,?, ?, ?, ?)";
    try {
      const result = await query(sql, [
        name,
        username,
        password,
        balance,
        role_id,
      ]);
      return { ...result };
    } catch (error) {
      console.error("Error in authRegister:", error.message);
      throw error;
    }
  },

  // kiểm tra đã tồn tại khác hàng
};
