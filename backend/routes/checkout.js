const express = require('express');

const checkoutController = require('../controllers/checkoutController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', checkoutController.createOrder);
router.get('/orders', checkoutController.listOrders);

module.exports = router;
