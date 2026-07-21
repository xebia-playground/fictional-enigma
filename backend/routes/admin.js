const express = require('express');

const ActivityLog = require('../models/ActivityLog');
const Product = require('../models/Product');
const StoreSetting = require('../models/StoreSetting');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get('/products', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Could not create product.', error: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Could not update product.', error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  res.json({ message: 'Product deleted.' });
});

router.get('/settings', async (req, res) => {
  const settings = await StoreSetting.findOneAndUpdate(
    { key: 'store-preferences' },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json(settings.preferences);
});

router.put('/settings', async (req, res) => {
  const settings = await StoreSetting.findOneAndUpdate(
    { key: 'store-preferences' },
    { preferences: req.body },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json(settings.preferences);
});

router.get('/analytics', async (req, res) => {
  const [userCount, productCount, logs] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    ActivityLog.find().sort({ createdAt: -1 }).limit(50).populate('user', 'username email'),
  ]);

  res.json({ userCount, productCount, logs });
});

module.exports = router;
