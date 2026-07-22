const adminService = require('../services/adminService');

const listProducts = async (req, res) => {
  const products = await adminService.listProducts();
  res.json(products);
};

const createProduct = async (req, res) => {
  try {
    const product = await adminService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Could not create product.', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await adminService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message || 'Could not update product.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await adminService.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Could not delete product.' });
  }
};

const getSettings = async (req, res) => {
  const preferences = await adminService.getSettings();
  res.json(preferences);
};

const updateSettings = async (req, res) => {
  const preferences = await adminService.updateSettings(req.body);
  res.json(preferences);
};

const getAnalytics = async (req, res) => {
  const analytics = await adminService.getAnalytics();
  res.json(analytics);
};

module.exports = {
  createProduct,
  deleteProduct,
  getAnalytics,
  getSettings,
  listProducts,
  updateProduct,
  updateSettings,
};