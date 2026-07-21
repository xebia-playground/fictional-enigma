import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { apiRequest } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();

      if (searchTerm) params.set('q', searchTerm);

      const result = await apiRequest(`/products?${params.toString()}`);
      setProducts(result);
      setResultMessage(searchTerm ? `Search returned ${result.length} products.` : '');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    fetchProducts();
  };

  return (
    <section className="stacked-page">
      <div className="hero-band">
        <div>
          <span className="eyebrow">Clean commerce starter</span>
          <h1>Browse products, manage carts, and test CodeQL-ready flows.</h1>
        </div>
        <form className="search-panel" onSubmit={submitSearch}>
          <label>
            Search
            <div className="input-with-icon">
              <Search size={18} />
              <input
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder='Search by name/category or try {"category":{"$ne":null}}'
                value={searchTerm}
              />
            </div>
          </label>
          <button type="submit">Search</button>
        </form>
      </div>

      {error && <p className="alert">{error}</p>}
      {resultMessage && <p className="muted">{resultMessage}</p>}
      {loading ? (
        <p className="muted">Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {products.length === 0 && <p className="muted">No products found.</p>}
        </div>
      )}
    </section>
  );
};

export default ProductListPage;