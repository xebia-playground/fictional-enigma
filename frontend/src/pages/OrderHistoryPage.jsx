import { useEffect, useState } from 'react';

import { apiRequest, formatCurrency } from '../api/client.js';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/checkout/orders').then(setOrders).catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <section className="stacked-page narrow">
      <h1>Order History</h1>
      {error && <p className="alert">{error}</p>}
      {orders.map((order) => (
        <article className="order-card" key={order._id}>
          <div className="summary-row">
            <strong>{new Date(order.createdAt).toLocaleString()}</strong>
            <span className="pill">{order.status}</span>
          </div>
          <p>{order.items.length} items · {formatCurrency(order.total)}</p>
        </article>
      ))}
      {orders.length === 0 && !error && <p className="muted">No orders yet.</p>}
    </section>
  );
};

export default OrderHistoryPage;