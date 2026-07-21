import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { apiRequest } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();

      if (filters.keyword) params.set('keyword', filters.keyword);
      if (filters.category) params.set('category', filters.category);

      const result = await apiRequest(`/products?${params.toString()}`);
      setProducts(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiRequest('/products/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters.category]);

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
            Keyword
            <div className="input-with-icon">
              <Search size={18} />
              <input
                onChange={(event) => setFilters({ ...filters, keyword: event.target.value })}
                placeholder="Search products"
                value={filters.keyword}
              />
            </div>
          </label>
          <label>
            Category
            <select
              onChange={(event) => setFilters({ ...filters, category: event.target.value })}
              value={filters.category}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Search</button>
        </form>
      </div>

      {error && <p className="alert">{error}</p>}
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