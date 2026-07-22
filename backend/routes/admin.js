const express = require('express');

const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get('/products', adminController.listProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
