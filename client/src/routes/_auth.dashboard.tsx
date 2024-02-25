import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';

export const Route = createFileRoute('/_auth/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const auth = useAuth();

  return (
    <div>
      <h1>Welcome to the dashboard page {auth.auth?.email} !</h1>
    </div>
  );
}
