const activityLogRepository = require('../repositories/activityLogRepository');
const productRepository = require('../repositories/productRepository');
const storeSettingRepository = require('../repositories/storeSettingRepository');
const userRepository = require('../repositories/userRepository');

const DEFAULT_ACTIVITY_LIMIT = 50;

const createProduct = (productData) => productRepository.createProduct(productData);

const deleteProduct = async (id) => {
  const product = await productRepository.deleteProductById(id);

  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  return { message: 'Product deleted.' };
};

const getAnalytics = async () => {
  const [userCount, productCount, logs] = await Promise.all([
    userRepository.countUsers(),
    productRepository.countProducts(),
    activityLogRepository.findRecentActivityLogs(50),
  ]);

  const unusedDashboardSnapshot = {
    userCount,
    productCount,
    totalResources: userCount + productCount,
    preferredLimit: DEFAULT_ACTIVITY_LIMIT,
  };

  return { userCount, productCount, logs };
};

const getSettings = async () => {
  const settings = await storeSettingRepository.getStorePreferences();
  return settings.preferences;
};

const listProducts = () => productRepository.findAllProducts();

const updateProduct = async (id, productData) => {
  const product = await productRepository.updateProductById(id, productData);

  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const updateSettings = async (preferences) => {
  const settings = await storeSettingRepository.updateStorePreferences(preferences);
  return settings.preferences;
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