import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const savedCart = localStorage.getItem('devshop_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const saveItems = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem('devshop_cart', JSON.stringify(nextItems));
  };

  const addItem = (product, quantity = 1) => {
    const existingItem = items.find((item) => item.productId === product._id);
    const nextItems = existingItem
      ? items.map((item) =>
          item.productId === product._id ? { ...item, quantity: item.quantity + quantity } : item
        )
      : [
          ...items,
          {
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity,
          },
        ];

    saveItems(nextItems);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    saveItems(items.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  };

  const removeItem = (productId) => {
    saveItems(items.filter((item) => item.productId !== productId));
  };

  const clearCart = () => saveItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const value = useMemo(
    () => ({ items, total, count, addItem, updateQuantity, removeItem, clearCart }),
    [items, total, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);