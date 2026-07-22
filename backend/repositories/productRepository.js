const Product = require('../models/Product');

const countProducts = () => Product.countDocuments();

const createProduct = (productData) => Product.create(productData);

const deleteProductById = (id) => Product.findByIdAndDelete(id);

const findAllProducts = () => Product.find().sort({ createdAt: -1 });

const findProductById = (id) => Product.findById(id);

const findProducts = (filter) => Product.find(filter).sort({ createdAt: -1 });

const findProductsByIds = (ids) => Product.find({ _id: { $in: ids } });

const listCategories = () => Product.distinct('category');

const saveProduct = (product) => product.save();

const updateProductById = (id, productData) =>
  Product.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  });

module.exports = {
  countProducts,
  createProduct,
  deleteProductById,
  findAllProducts,
  findProductById,
  findProducts,
  findProductsByIds,
  listCategories,
  saveProduct,
  updateProductById,
};