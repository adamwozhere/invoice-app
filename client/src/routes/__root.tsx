import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { AuthContextType } from '../context/AuthProvider';
import { useAuth } from '../hooks/useAuth';
import { QueryClient } from '@tanstack/react-query';

interface RouterContext {
  queryClient: QueryClient;
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const auth = useAuth();

  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        {auth?.auth?.isAuthenticated ? (
          `Hello ${auth?.auth.email}!`
        ) : (
          <Link to="/login" className="[&.active]:font-bold">
            Login
          </Link>
        )}
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/dashboard" className="[&.active]:font-bold">
          Dashboard
        </Link>
        <Link to="/invoices" className="[&.active]:font-bold">
          Invoices
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

