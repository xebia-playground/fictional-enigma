const checkoutService = require('../services/checkoutService');

const createOrder = async (req, res) => {
  try {
    const order = await checkoutService.createOrder(req.user, req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: 'Checkout failed.', error: error.message });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await checkoutService.listUserOrders(req.user._id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Could not load orders.', error: error.message });
  }
};

module.exports = {
  createOrder,
  listOrders,
};