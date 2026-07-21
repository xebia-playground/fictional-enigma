import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { apiRequest, formatCurrency } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');

  const loadProduct = async () => {
    try {
      setProduct(await apiRequest(`/products/${id}`));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setProduct(
        await apiRequest(`/products/${id}/reviews`, {
          method: 'POST',
          body: JSON.stringify({ ...review, rating: Number(review.rating) }),
        })
      );
      setReview({ rating: 5, comment: '' });
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!product) {
    return <p className="muted">{error || 'Loading product...'}</p>;
  }

  return (
    <section className="detail-layout">
      <img className="detail-image" src={product.image} alt={product.title} />
      <div className="detail-panel">
        <span className="pill">{product.category}</span>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <strong className="price-line">{formatCurrency(product.price)}</strong>
        <button type="button" onClick={() => addItem(product)}>
          Add to cart
        </button>

        <section className="reviews-block">
          <h2>Reviews</h2>
          {product.reviews?.map((item) => (
            <article className="review" key={item._id}>
              <strong>{item.username}</strong>
              <span>{'★'.repeat(item.rating)}</span>
              <p>{item.comment}</p>
            </article>
          ))}
          {product.reviews?.length === 0 && <p className="muted">No reviews yet.</p>}
          {user ? (
            <form className="form-card compact" onSubmit={submitReview}>
              {error && <p className="alert">{error}</p>}
              <label>
                Rating
                <select
                  onChange={(event) => setReview({ ...review, rating: event.target.value })}
                  value={review.rating}
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Comment
                <textarea
                  onChange={(event) => setReview({ ...review, comment: event.target.value })}
                  required
                  value={review.comment}
                />
              </label>
              <button type="submit">Submit review</button>
            </form>
          ) : (
            <p className="muted">Login to leave a review.</p>
          )}
        </section>
      </div>
    </section>
  );
};

export default ProductDetailPage;