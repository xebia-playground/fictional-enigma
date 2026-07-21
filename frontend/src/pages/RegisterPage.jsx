import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await register(form);
      navigate('/');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <h1>Create Account</h1>
        {error && <p className="alert">{error}</p>}
        <label>
          Username
          <input onChange={(event) => setForm({ ...form, username: event.target.value })} value={form.username} />
        </label>
        <label>
          Email
          <input onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" value={form.email} />
        </label>
        <label>
          Password
          <input onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" value={form.password} />
        </label>
        <button type="submit">Register</button>
      </form>
    </section>
  );
};

export default RegisterPage;