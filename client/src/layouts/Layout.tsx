import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div>
      <nav>
        <menu>
          {user ? (
            <>
              <span>Hello {user.email} !</span>
              <button onClick={logout}>logout</button>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
          <Link to="/">Home</Link>
          <Link to="/invoices">Invoices</Link>
          <Link to="/customers">Customers</Link>
        </menu>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

