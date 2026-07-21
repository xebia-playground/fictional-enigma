import { Link } from 'react-router-dom';

import { formatCurrency } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';

const CartPage = () => {
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <section className="stacked-page narrow">
      <h1>Shopping Cart</h1>
      {items.length === 0 ? (
        <p className="muted">Your cart is empty.</p>
      ) : (
        <>
          <div className="line-item-list">
            {items.map((item) => (
              <article className="line-item" key={item.productId}>
                <img src={item.image} alt={item.title} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{formatCurrency(item.price)}</p>
                </div>
                <input
                  min="1"
                  onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                  type="number"
                  value={item.quantity}
                />
                <button className="ghost-button" onClick={() => removeItem(item.productId)} type="button">
                  Remove
                </button>
              </article>
            ))}
          </div>
          <div className="summary-row">
            <strong>Total: {formatCurrency(total)}</strong>
            <Link className="primary-link" to="/checkout">Checkout</Link>
          </div>
        </>
      )}
    </section>
  );
};

export default CartPage;