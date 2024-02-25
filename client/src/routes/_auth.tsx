import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    console.log('_auth beforeLoad()');
    if (!context.auth.auth?.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => {
    return <Outlet />;
  },
});

// TODO: make the component useEffect to get auth refresh on first app load? or do that in App?
