const db = require("../../../config/database.conf");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

module.exports.Customers = {
  findAllCustomer: async () => {
    const sql = "SELECT customer_id, name, balance,phone, email FROM Customer";
    try {
      const result = await query(sql);
      return result || null;
    } catch (error) {
      console.error("Error in findAllCustomer:", error.message);
      throw error;
    }
  },
};
