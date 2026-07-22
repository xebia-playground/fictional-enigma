const express = require('express');

const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', productController.listProducts);
router.get('/categories', productController.listCategories);
router.get('/:id', productController.getProduct);
router.post('/:id/reviews', authenticate, productController.addReview);

module.exports = router;