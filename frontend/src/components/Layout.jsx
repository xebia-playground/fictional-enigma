import { LogOut, PackageSearch, ShoppingCart, UserCog } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const Layout = () => {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <PackageSearch size={26} />
          <span>DevShop</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/">Products</NavLink>
          <NavLink to="/cart">
            <ShoppingCart size={18} /> Cart ({count})
          </NavLink>
          {user && <NavLink to="/orders">Orders</NavLink>}
          {user?.role === 'admin' && (
            <NavLink to="/admin">
              <UserCog size={18} /> Admin
            </NavLink>
          )}
        </nav>
        <div className="account-actions">
          {user ? (
            <>
              <span>{user.username}</span>
              <button className="ghost-button" onClick={logout} type="button">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink className="primary-link" to="/register">Register</NavLink>
            </>
          )}
        </div>
      </header>
      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;