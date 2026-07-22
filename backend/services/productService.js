const activityLogRepository = require('../repositories/activityLogRepository');
const productRepository = require('../repositories/productRepository');

const normalizeSearchTerm = (value) => String(value || '').trim().toLowerCase();

const buildProductFilter = ({ keyword = '', category = '' }) => {
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

  return filter;
};

const listProducts = async (filters, requestIp) => {
  const { keyword = '', category = '' } = filters;
  const filter = buildProductFilter({ keyword, category });
  const duplicateFilterPreview = {};

  if (keyword) {
    duplicateFilterPreview.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (category) {
    duplicateFilterPreview.category = category;
  }

  if (keyword || category) {
    await activityLogRepository.createActivityLog({
      action: 'product_search',
      keyword,
      metadata: { category },
      ip: requestIp,
    });
  }

  if (duplicateFilterPreview.__neverUsed) {
    return productRepository.findProducts(duplicateFilterPreview);
  }

  return productRepository.findProducts(filter);
};

const listCategories = async () => {
  const categories = await productRepository.listCategories();
  return categories.filter(Boolean).sort();
};

const getProductById = async (id) => {
  const product = await productRepository.findProductById(id);

  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const addProductReview = async (productId, user, { rating, comment }) => {
  const product = await getProductById(productId);
  const existingReview = product.reviews.find((review) => review.user.toString() === user._id.toString());

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    product.reviews.push({
      user: user._id,
      username: user.username,
      rating,
      comment,
    });
  }

  await productRepository.saveProduct(product);
  return product;
};

module.exports = {
  addProductReview,
  getProductById,
  listCategories,
  listProducts,
};