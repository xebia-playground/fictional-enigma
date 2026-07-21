import { createContext, useContext, useMemo, useState } from 'react';

import { apiRequest } from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('devshop_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const persistSession = ({ token, user: nextUser }) => {
    localStorage.setItem('devshop_token', token);
    localStorage.setItem('devshop_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (credentials) => {
    const session = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    persistSession(session);
  };

  const register = async (details) => {
    const session = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    });
    persistSession(session);
  };

  const logout = () => {
    localStorage.removeItem('devshop_token');
    localStorage.removeItem('devshop_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);