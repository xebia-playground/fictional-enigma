import { useEffect, useState } from 'react';

import { apiRequest, formatCurrency } from '../api/client.js';

const emptyProduct = { title: '', description: '', price: '', category: '', image: '', stock: 0 };

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [settingsJson, setSettingsJson] = useState('{}');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadAdminData = async () => {
    const [productData, settingsData, analyticsData] = await Promise.all([
      apiRequest('/admin/products'),
      apiRequest('/admin/settings'),
      apiRequest('/admin/analytics'),
    ]);

    setProducts(productData);
    setSettingsJson(JSON.stringify(settingsData, null, 2));
    setAnalytics(analyticsData);
  };

  useEffect(() => {
    loadAdminData().catch((error) => setMessage(error.message));
  }, []);

  const saveProduct = async (event) => {
    event.preventDefault();
    const payload = { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock) };
    const path = editingId ? `/admin/products/${editingId}` : '/admin/products';
    const method = editingId ? 'PUT' : 'POST';

    await apiRequest(path, { method, body: JSON.stringify(payload) });
    setProductForm(emptyProduct);
    setEditingId(null);
    await loadAdminData();
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
    });
  };

  const deleteProduct = async (id) => {
    await apiRequest(`/admin/products/${id}`, { method: 'DELETE' });
    await loadAdminData();
  };

  const saveSettings = async () => {
    try {
      await apiRequest('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(JSON.parse(settingsJson)),
      });
      setMessage('Settings saved.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="admin-grid">
      <div className="admin-main">
        <h1>Admin Dashboard</h1>
        {message && <p className="alert">{message}</p>}
        <form className="form-card" onSubmit={saveProduct}>
          <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
          {['title', 'category', 'image'].map((field) => (
            <label key={field}>
              {field}
              <input
                onChange={(event) => setProductForm({ ...productForm, [field]: event.target.value })}
                required={field !== 'image'}
                value={productForm[field]}
              />
            </label>
          ))}
          <label>
            Description
            <textarea
              onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
              required
              value={productForm.description}
            />
          </label>
          <div className="two-column">
            <label>
              Price
              <input
                onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                required
                type="number"
                value={productForm.price}
              />
            </label>
            <label>
              Stock
              <input
                onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
                type="number"
                value={productForm.stock}
              />
            </label>
          </div>
          <button type="submit">Save product</button>
        </form>

        <div className="product-table">
          {products.map((product) => (
            <article className="admin-product" key={product._id}>
              <strong>{product.title}</strong>
              <span>{product.category}</span>
              <span>{formatCurrency(product.price)}</span>
              <button className="ghost-button" onClick={() => editProduct(product)} type="button">Edit</button>
              <button className="danger-button" onClick={() => deleteProduct(product._id)} type="button">Delete</button>
            </article>
          ))}
        </div>
      </div>

      <aside className="admin-side">
        <section className="form-card">
          <h2>Store Settings JSON</h2>
          <textarea
            className="json-input"
            onChange={(event) => setSettingsJson(event.target.value)}
            value={settingsJson}
          />
          <button onClick={saveSettings} type="button">Save settings</button>
        </section>

        <section className="form-card">
          <h2>Analytics</h2>
          <p>Users: {analytics?.userCount ?? 0}</p>
          <p>Products: {analytics?.productCount ?? 0}</p>
          <div className="log-list">
            {analytics?.logs?.map((log) => (
              <p key={log._id}>{log.action}: {log.keyword || log.metadata?.category || 'activity'}</p>
            ))}
          </div>
        </section>
      </aside>
    </section>
  );
};

export default AdminDashboard;