const { Customers } = require("../models/customers.model");

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customers.findAllCustomer();
    res.status(200).json({ status: "success", data: customers });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { getAllCustomers };
