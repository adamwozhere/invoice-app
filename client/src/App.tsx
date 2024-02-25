import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

// providers and hooks
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// create Query client
const queryClient = new QueryClient();

// create router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: {
    queryClient,
    auth: undefined!, // this will be set after wrapping in an AuthProvider
  },
});

// register router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// create app router with auth context
// ( queryClient does not need to be added to context here as it is not a react hook,
// it is declared outside the component and added directly to router instance )
function Router() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

// main app component with providers
export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </AuthProvider>
  );
}

