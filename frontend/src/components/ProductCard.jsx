import { Link } from 'react-router-dom';

import { formatCurrency } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`}>
        <img src={product.image} alt={product.title} />
      </Link>
      <div className="product-card-body">
        <span className="pill">{product.category}</span>
        <Link className="product-title" to={`/products/${product._id}`}>
          {product.title}
        </Link>
        <p>{product.description}</p>
        <div className="product-card-footer">
          <strong>{formatCurrency(product.price)}</strong>
          <button type="button" onClick={() => addItem(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;