import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen w-full flex">
      <section className="px-4 py-8 bg-green-700 text-white">
        <div className="mb-8 flex">
          <a href="/" className="text-3xl text-bold">
            Mint.
          </a>
          <div className="bg-green-200 w-4 h-4 rounded-tl-lg rounded-br-lg"></div>
        </div>
        <nav className="flex flex-col gap-8">
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
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/invoices">Invoices</Link>
            </li>
            <li>
              <Link to="/customers">Customers</Link>
            </li>
          </menu>
        </nav>
      </section>
      <main className="flex bg-gray-200 w-full justify-center px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

