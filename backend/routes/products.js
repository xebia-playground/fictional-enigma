const express = require('express');

const Product = require('../models/Product');
const productController = require('../controllers/productController');
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

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});
router.get('/categories', productController.listCategories);
router.get('/:id', productController.getProduct);
router.post('/:id/reviews', authenticate, productController.addReview);

module.exports = router;