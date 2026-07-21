const express = require('express');

const ActivityLog = require('../models/ActivityLog');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { keyword = '', category = '' } = req.query;
  const filter = {};

  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (keyword || category) {
    await ActivityLog.create({
      action: 'product_search',
      keyword,
      metadata: { category },
      ip: req.ip,
    });
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

router.get('/categories', async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories.filter(Boolean).sort());
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  res.json(product);
});

router.post('/:id/reviews', authenticate, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const existingReview = product.reviews.find((review) => review.user.toString() === req.user._id.toString());

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    product.reviews.push({
      user: req.user._id,
      username: req.user.username,
      rating,
      comment,
    });
  }

  await product.save();
  res.status(201).json(product);
});

module.exports = router;