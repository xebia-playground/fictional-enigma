const orderRepository = require('../../repositories/orderRepository');
const productRepository = require('../../repositories/productRepository');
const checkoutService = require('../checkoutService');

jest.mock('../../repositories/orderRepository');
jest.mock('../../repositories/productRepository');

describe('checkoutService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('rejects an empty cart with a 400 status code', async () => {
      await expect(
        checkoutService.createOrder({ _id: 'user-1' }, { items: [], shippingAddress: {} })
      ).rejects.toMatchObject({
        message: 'Cart items are required.',
        statusCode: 400,
      });

      expect(productRepository.findProductsByIds).not.toHaveBeenCalled();
      expect(orderRepository.createOrder).not.toHaveBeenCalled();
    });

    it('creates an order from catalog prices and normalized quantities', async () => {
      const createdOrder = { _id: 'order-1', status: 'placed' };
      productRepository.findProductsByIds.mockResolvedValue([
        {
          _id: { toString: () => 'product-1' },
          title: 'Wireless Mouse',
          price: 25,
          image: 'https://example.com/mouse.jpg',
        },
        {
          _id: { toString: () => 'product-2' },
          title: 'Mechanical Keyboard',
          price: 75,
          image: 'https://example.com/keyboard.jpg',
        },
      ]);
      orderRepository.createOrder.mockResolvedValue(createdOrder);

      const order = await checkoutService.createOrder(
        { _id: 'user-1' },
        {
          items: [
            { productId: 'product-1', quantity: 2 },
            { productId: 'product-2', quantity: 0 },
          ],
          shippingAddress: { city: 'Kolkata' },
        }
      );

      expect(productRepository.findProductsByIds).toHaveBeenCalledWith(['product-1', 'product-2']);
      expect(orderRepository.createOrder).toHaveBeenCalledWith({
        user: 'user-1',
        items: [
          {
            product: { toString: expect.any(Function) },
            title: 'Wireless Mouse',
            price: 25,
            quantity: 2,
            image: 'https://example.com/mouse.jpg',
          },
          {
            product: { toString: expect.any(Function) },
            title: 'Mechanical Keyboard',
            price: 75,
            quantity: 1,
            image: 'https://example.com/keyboard.jpg',
          },
        ],
        shippingAddress: { city: 'Kolkata' },
        total: 125,
        status: 'placed',
      });
      expect(order).toBe(createdOrder);
    });

    it('fails when a cart product is missing from the catalog', async () => {
      productRepository.findProductsByIds.mockResolvedValue([]);

      await expect(
        checkoutService.createOrder(
          { _id: 'user-1' },
          { items: [{ productId: 'missing-product', quantity: 1 }], shippingAddress: {} }
        )
      ).rejects.toThrow('One or more products are no longer available.');

      expect(orderRepository.createOrder).not.toHaveBeenCalled();
    });
  });

  describe('listUserOrders', () => {
    it('delegates to the order repository', async () => {
      const orders = [{ _id: 'order-1' }];
      orderRepository.findOrdersByUser.mockResolvedValue(orders);

      await expect(checkoutService.listUserOrders('user-1')).resolves.toBe(orders);

      expect(orderRepository.findOrdersByUser).toHaveBeenCalledWith('user-1');
    });
  });
});