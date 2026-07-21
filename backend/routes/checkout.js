const express = require('express');

const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required.' });
    }

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const orderItems = items.map((item) => {
      const product = products.find((entry) => entry._id.toString() === item.productId);

      if (!product) {
        throw new Error('One or more products are no longer available.');
      }

      return {
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: Math.max(1, Number(item.quantity) || 1),
        image: product.image,
      };
    });

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      total,
      status: 'placed',
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Checkout failed.', error: error.message });
  }
});

router.get('/orders', async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
