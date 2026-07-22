const Order = require('../models/Order');

const createOrder = (orderData) => Order.create(orderData);

const findOrdersByUser = (userId) => Order.find({ user: userId }).sort({ createdAt: -1 });

module.exports = {
  createOrder,
  findOrdersByUser,
};