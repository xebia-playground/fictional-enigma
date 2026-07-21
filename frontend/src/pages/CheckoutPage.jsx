import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { apiRequest, formatCurrency } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState({ fullName: '', address: '', city: '', country: '' });
  const [error, setError] = useState('');

  const placeOrder = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await apiRequest('/checkout', {
        method: 'POST',
        body: JSON.stringify({ items, shippingAddress }),
      });
      clearCart();
      navigate('/orders');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="stacked-page narrow">
      <h1>Checkout</h1>
      {error && <p className="alert">{error}</p>}
      <form className="form-card" onSubmit={placeOrder}>
        {['fullName', 'address', 'city', 'country'].map((field) => (
          <label key={field}>
            {field.replace(/([A-Z])/g, ' $1')}
            <input
              onChange={(event) => setShippingAddress({ ...shippingAddress, [field]: event.target.value })}
              required
              value={shippingAddress[field]}
            />
          </label>
        ))}
        <strong>Order total: {formatCurrency(total)}</strong>
        <button disabled={items.length === 0} type="submit">Place order</button>
      </form>
    </section>
  );
};

export default CheckoutPage;