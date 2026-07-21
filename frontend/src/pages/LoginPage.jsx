import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(form);
      navigate('/');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <h1>Login</h1>
        {error && <p className="alert">{error}</p>}
        <label>
          Email
          <input onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" value={form.email} />
        </label>
        <label>
          Password
          <input onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" value={form.password} />
        </label>
        <button type="submit">Login</button>
        <p className="muted">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  );
};

export default LoginPage;