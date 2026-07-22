const productService = require('../services/productService');

const listProducts = async (req, res) => {
  try {
    const products = await productService.listProducts(req.query, req.ip);
    res.json(products);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Could not load products.' });
  }
};

const listCategories = async (req, res) => {
  try {
    const categories = await productService.listCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Could not load categories.', error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Could not load product.' });
  }
};

const addReview = async (req, res) => {
  try {
    const product = await productService.addProductReview(req.params.id, req.user, req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Could not save review.' });
  }
};

module.exports = {
  addReview,
  getProduct,
  listCategories,
  listProducts,
};