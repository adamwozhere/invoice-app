import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
// routes
import AuthProvider from './providers/AuthProvider';
import Layout from './layouts/Layout';
import Index from './routes/Index';
import Login from './routes/Login';
import Invoices from './routes/Invoices';
import Invoice from './routes/Invoice';
import Customers from './routes/Customers';
import RequireAuth from './layouts/RequireAuth';
import EditInvoice from './routes/EditInvoice';
import Customer from './routes/Customer';
import EditCustomer from './routes/EditCustomer';
import NewCustomer from './routes/NewCustomer';

interface HttpError extends Error {
  response?: {
    status: number;
  };
}

// create Query client - TODO: add the logic for not retrying on 403 - let axios handle it
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: HttpError) => {
        if (error.response?.status === 403) {
          return false;
        }
        return failureCount <= 3;
      },
      // refetchOnMount: false,
      // refetchOnReconnect: false,
      // refetchOnWindowFocus: false,
    },
  },
});

// const queryClient = new QueryClient();

// create router instance

// main app component with providers
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route element={<RequireAuth />}>
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/:invoiceId" element={<Invoice />} />
              <Route
                path="/invoices/:invoiceId/edit"
                element={<EditInvoice />}
              />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/new" element={<NewCustomer />} />
              <Route path="/customers/:customerId" element={<Customer />} />
              <Route
                path="/customers/:customerId/edit"
                element={<EditCustomer />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

