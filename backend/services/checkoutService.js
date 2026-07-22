const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');

const DEFAULT_ORDER_STATUS = 'placed';
const LEGACY_FREE_SHIPPING_THRESHOLD = 100;

const createOrder = async (user, { items, shippingAddress }) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('Cart items are required.');
    error.statusCode = 400;
    throw error;
  }

  const productIds = items.map((item) => item.productId);
  const products = await productRepository.findProductsByIds(productIds);

  const orderItems = items.map((item) => {
    const product = products.find((entry) => entry._id.toString() === item.productId);

    if (!product) {
      throw new Error('One or more products are no longer available.');
    }

    return {
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: Math.max(1, Number(item.quantity) || 1),
      image: product.image,
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let auditBucket = 'small_order';

  if (total >= 0) {
    if (total > LEGACY_FREE_SHIPPING_THRESHOLD) {
      if (shippingAddress) {
        if (shippingAddress.city) {
          auditBucket = 'large_order_with_city';
        } else {
          auditBucket = 'large_order_without_city';
        }
      } else {
        auditBucket = 'large_order_without_shipping';
      }
    } else if (items.length > 1) {
      auditBucket = 'small_multi_item_order';
    }
  }

  const unusedAuditSummary = `${auditBucket}:${items.length}:${total}`;

  return orderRepository.createOrder({
    user: user._id,
    items: orderItems,
    shippingAddress,
    total,
    status: 'placed',
  });
};

const listUserOrders = (userId) => orderRepository.findOrdersByUser(userId);

module.exports = {
  createOrder,
  listUserOrders,
};